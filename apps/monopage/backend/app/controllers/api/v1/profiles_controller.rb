class Api::V1::ProfilesController < ApplicationController
  skip_before_action :authorized, only: [:public_show]

  # GET /api/v1/profiles — 내 모든 프로필 목록
  def index
    profiles = current_user.profiles.order(:created_at)
    render json: profiles.map { |p|
      p.as_json.merge(
        links_count: p.links.count,
        portfolio_count: p.portfolio_items.count,
        inquiries_count: p.inquiries.count
      )
    }
  end

  # GET /api/v1/profile — 기본 프로필 (하위 호환)
  def show
    p = params[:id] ? current_user.profiles.find(params[:id]) : current_user.profile
    profile_json = p.as_json(include: [:links, :social_accounts])
    profile_json['email'] = current_user.email
    profile_json['provider'] = current_user.provider
    render json: profile_json
  end

  # PATCH /api/v1/profile — 프로필 수정
  def update
    p = params[:id] ? current_user.profiles.find(params[:id]) : current_user.profile
    if p.update(profile_params)
      render json: p
    else
      render json: { errors: p.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # POST /api/v1/profiles — 새 프로필 생성
  def create
    username = (params[:username] || '').downcase.gsub(/[^a-z0-9_-]/, '')
    if username.blank?
      return render json: { errors: ['영문 주소를 입력해주세요'] }, status: :unprocessable_entity
    end

    profile = current_user.profiles.build(
      username: username,
      bio: params[:bio] || '',
      avatar_url: params[:avatar_url] || '',
      display_name: params[:display_name] || '',
    )
    if profile.save
      render json: profile, status: :created
    else
      render json: { errors: profile.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def change_password
    user = current_user
    if user.provider.present?
      return render json: { error: '소셜 로그인 계정은 비밀번호를 변경할 수 없어요' }, status: :unprocessable_entity
    end
    unless user.authenticate(params[:current_password])
      return render json: { error: '현재 비밀번호가 올바르지 않아요' }, status: :unprocessable_entity
    end
    if params[:new_password].blank? || params[:new_password].length < 6
      return render json: { error: '새 비밀번호는 6자 이상이어야 해요' }, status: :unprocessable_entity
    end
    user.update!(password: params[:new_password])
    render json: { message: '비밀번호가 변경됐어요' }
  end

  def destroy
    if params[:id]
      profile = current_user.profiles.find(params[:id])
      profile.destroy!
      render json: { message: '페이지가 삭제됐어요' }
    else
      current_user.destroy!
      render json: { message: '계정이 삭제됐어요' }
    end
  end

  def public_show
    profile = Profile.find_by!(username: params[:username])
    render json: profile, include: [:links, :portfolio_items, { social_accounts: { include: :posts } }]
  end

  private

  def profile_params
    params.permit(:bio, :avatar_url, :username, :display_name, :knowledge_md, :theme_settings, theme_config: {})
  end
end
