class Api::V1::AuthController < ApplicationController
  skip_before_action :authorized, only: [:signup, :login]

  def signup
    username = (params[:username] || '').downcase.gsub(/[^a-z0-9_-]/, '')
    if username.blank?
      return render json: { errors: ['영문 주소를 입력해주세요'] }, status: :unprocessable_entity
    end

    user = User.new(user_params)
    if user.save
      profile = Profile.create!(user: user, username: username)
      token = encode_token({ user_id: user.id })
      render json: { user: user, profile: profile, token: token }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordInvalid => e
    user&.destroy
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  def login
    user = User.find_by(email: params[:email])
    if user&.authenticate(params[:password])
      token = encode_token({ user_id: user.id })
      render json: { user: user, profile: user.profile, token: token }, status: :ok
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end

  private

  def user_params
    params.permit(:email, :password)
  end
end
