class Api::V1::AuthController < ApplicationController
  skip_before_action :authorized, only: [:signup, :login]

  def signup
    user = User.new(user_params)
    if user.save
      profile = Profile.create(user: user, username: params[:username] || user.email.split('@')[0])
      token = encode_token({ user_id: user.id })
      render json: { user: user, profile: profile, token: token }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
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
