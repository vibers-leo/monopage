require 'net/http'
require 'json'

class Api::V1::SocialAuthController < ApplicationController
  skip_before_action :authorized, only: [:kakao, :naver, :google]

  # POST /api/v1/auth/kakao
  # body: { code: "...", redirect_uri: "..." }
  def kakao
    code = params[:code]
    redirect_uri = params[:redirect_uri] || "#{ENV['FRONTEND_URL']}/auth/kakao/callback"

    # 1. 인가코드 → 액세스 토큰
    token_res = kakao_exchange_token(code, redirect_uri)
    return render json: { error: '카카오 토큰 교환 실패' }, status: :unprocessable_entity unless token_res['access_token']

    # 2. 액세스 토큰 → 사용자 정보
    kakao_user = kakao_fetch_user(token_res['access_token'])
    return render json: { error: '카카오 사용자 정보 조회 실패' }, status: :unprocessable_entity unless kakao_user['id']

    uid        = kakao_user['id'].to_s
    kakao_acct = kakao_user.dig('kakao_account') || {}
    profile    = kakao_acct.dig('profile') || {}
    email      = kakao_acct['email']
    name       = profile['nickname'] || email&.split('@')&.first || "user_#{uid[0..5]}"
    avatar_url = profile['profile_image_url']

    # 3. find_or_create
    user = find_or_create_social_user(
      provider: 'kakao', uid: uid,
      email: email, name: name, avatar_url: avatar_url
    )

    jwt = encode_token({ user_id: user.id })
    render json: {
      token: jwt,
      user: user.as_json(only: [:id, :email, :name, :avatar_url, :provider]),
      profile: user.profile.as_json(only: [:username, :bio, :avatar_url, :display_name])
    }
  end

  # POST /api/v1/auth/naver
  def naver
    code         = params[:code]
    state        = params[:state]
    redirect_uri = params[:redirect_uri] || "#{ENV['FRONTEND_URL']}/auth/naver/callback"

    token_res = naver_exchange_token(code, state, redirect_uri)
    return render json: { error: '네이버 토큰 교환 실패' }, status: :unprocessable_entity unless token_res['access_token']

    naver_user = naver_fetch_user(token_res['access_token'])
    response_data = naver_user['response']
    return render json: { error: '네이버 사용자 정보 조회 실패' }, status: :unprocessable_entity unless response_data&.dig('id')

    uid        = response_data['id']
    email      = response_data['email']
    name       = response_data['name'] || response_data['nickname'] || email&.split('@')&.first || "user_#{uid[0..5]}"
    avatar_url = response_data['profile_image']

    user = find_or_create_social_user(
      provider: 'naver', uid: uid,
      email: email, name: name, avatar_url: avatar_url
    )

    jwt = encode_token({ user_id: user.id })
    render json: {
      token: jwt,
      user: user.as_json(only: [:id, :email, :name, :avatar_url, :provider]),
      profile: user.profile.as_json(only: [:username, :bio, :avatar_url, :display_name])
    }
  end

  # POST /api/v1/auth/google
  def google
    code         = params[:code]
    redirect_uri = params[:redirect_uri] || "#{ENV['FRONTEND_URL']}/auth/google/callback"

    token_res = google_exchange_token(code, redirect_uri)
    return render json: { error: '구글 토큰 교환 실패' }, status: :unprocessable_entity unless token_res['access_token']

    google_user = google_fetch_user(token_res['access_token'])
    return render json: { error: '구글 사용자 정보 조회 실패' }, status: :unprocessable_entity unless google_user['id']

    uid        = google_user['id']
    email      = google_user['email']
    name       = google_user['name'] || email&.split('@')&.first || "user_#{uid[0..5]}"
    avatar_url = google_user['picture']

    user = find_or_create_social_user(
      provider: 'google', uid: uid,
      email: email, name: name, avatar_url: avatar_url
    )

    jwt = encode_token({ user_id: user.id })
    render json: {
      token: jwt,
      user: user.as_json(only: [:id, :email, :name, :avatar_url, :provider]),
      profile: user.profile.as_json(only: [:username, :bio, :avatar_url, :display_name])
    }
  end

  # GET /api/v1/auth/connections
  def connections
    user = current_user
    render json: {
      provider: user.provider,
      uid: user.uid,
      has_password: user.password_digest.present?,
      email: user.email,
    }
  end

  # DELETE /api/v1/auth/connections
  def disconnect
    user = current_user
    if user.password_digest.blank?
      return render json: { error: '비밀번호를 먼저 설정해야 소셜 연동을 해제할 수 있습니다' }, status: :unprocessable_entity
    end
    user.update!(provider: nil, uid: nil)
    render json: { message: '소셜 연동이 해제되었습니다' }
  end

  private

  def find_or_create_social_user(provider:, uid:, email:, name:, avatar_url:)
    user = User.find_by(provider: provider, uid: uid)

    unless user
      # 같은 이메일로 일반 가입한 경우 연동
      user = User.find_by(email: email) if email.present?

      if user
        user.update!(provider: provider, uid: uid, name: name, avatar_url: avatar_url)
      else
        # 새 유저 생성
        username = generate_username(name)
        user = User.create!(
          provider: provider,
          uid: uid,
          email: email,
          name: name,
          avatar_url: avatar_url,
          password_digest: nil
        )
        user.profile.update!(
          display_name: name,
          avatar_url: avatar_url,
          username: username
        )
      end
    else
      # 프로필 이미지 등 최신화
      user.update(name: name, avatar_url: avatar_url)
    end

    user
  end

  def generate_username(name)
    base = name.gsub(/[^a-zA-Z0-9_-]/, '').downcase.presence || "user_#{SecureRandom.hex(3)}"
    candidate = base
    i = 1
    while Profile.exists?(username: candidate)
      candidate = "#{base}#{i}"
      i += 1
    end
    candidate
  end

  def google_exchange_token(code, redirect_uri)
    uri = URI('https://oauth2.googleapis.com/token')
    res = Net::HTTP.post_form(uri, {
      grant_type:    'authorization_code',
      client_id:     ENV['GOOGLE_CLIENT_ID'],
      client_secret: ENV['GOOGLE_CLIENT_SECRET'],
      redirect_uri:  redirect_uri,
      code:          code
    })
    JSON.parse(res.body)
  rescue => e
    Rails.logger.error "Google token exchange error: #{e}"
    {}
  end

  def google_fetch_user(access_token)
    uri = URI('https://www.googleapis.com/oauth2/v2/userinfo')
    req = Net::HTTP::Get.new(uri)
    req['Authorization'] = "Bearer #{access_token}"
    res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |h| h.request(req) }
    JSON.parse(res.body)
  rescue => e
    Rails.logger.error "Google user fetch error: #{e}"
    {}
  end

  def naver_exchange_token(code, state, redirect_uri)
    uri = URI('https://nid.naver.com/oauth2.0/token')
    res = Net::HTTP.post_form(uri, {
      grant_type:    'authorization_code',
      client_id:     ENV['NAVER_CLIENT_ID'],
      client_secret: ENV['NAVER_CLIENT_SECRET'],
      redirect_uri:  redirect_uri,
      code:          code,
      state:         state
    })
    JSON.parse(res.body)
  rescue => e
    Rails.logger.error "Naver token exchange error: #{e}"
    {}
  end

  def naver_fetch_user(access_token)
    uri = URI('https://openapi.naver.com/v1/nid/me')
    req = Net::HTTP::Get.new(uri)
    req['Authorization'] = "Bearer #{access_token}"
    res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |h| h.request(req) }
    JSON.parse(res.body)
  rescue => e
    Rails.logger.error "Naver user fetch error: #{e}"
    {}
  end

  def kakao_exchange_token(code, redirect_uri)
    uri = URI('https://kauth.kakao.com/oauth/token')
    res = Net::HTTP.post_form(uri, {
      grant_type:   'authorization_code',
      client_id:    ENV['KAKAO_REST_API_KEY'],
      redirect_uri: redirect_uri,
      code:         code
    })
    JSON.parse(res.body)
  rescue => e
    Rails.logger.error "Kakao token exchange error: #{e}"
    {}
  end

  def kakao_fetch_user(access_token)
    uri = URI('https://kapi.kakao.com/v2/user/me')
    req = Net::HTTP::Get.new(uri)
    req['Authorization'] = "Bearer #{access_token}"
    req['Content-type'] = 'application/x-www-form-urlencoded;charset=utf-8'

    res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |h| h.request(req) }
    JSON.parse(res.body)
  rescue => e
    Rails.logger.error "Kakao user fetch error: #{e}"
    {}
  end
end
