class Api::V1::ProfilesController < ApplicationController
  skip_before_action :authorized, only: [:public_show]

  def show
    render json: current_user.profile, include: [:links, :social_accounts]
  end

  def update
    profile = current_user.profile
    if profile.update(profile_params)
      render json: profile
    else
      render json: { errors: profile.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def public_show
    profile = Profile.find_by!(username: params[:username])
    render json: profile, include: [:links, { social_accounts: { include: :posts } }]
  end

  private

  def profile_params
    params.permit(:bio, :avatar_url, :theme_settings)
  end
end
