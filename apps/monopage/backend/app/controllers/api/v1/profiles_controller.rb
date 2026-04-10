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

  def change_password
    user = current_user
    if user.provider.present?
      return render json: { error: '소셜 로그인 계정은 비밀번호를 변경할 수 없습니다' }, status: :unprocessable_entity
    end
    unless user.authenticate(params[:current_password])
      return render json: { error: '현재 비밀번호가 올바르지 않습니다' }, status: :unprocessable_entity
    end
    if params[:new_password].blank? || params[:new_password].length < 6
      return render json: { error: '새 비밀번호는 6자 이상이어야 합니다' }, status: :unprocessable_entity
    end
    user.update!(password: params[:new_password])
    render json: { message: '비밀번호가 변경되었습니다' }
  end

  def destroy
    current_user.destroy!
    render json: { message: '계정이 삭제되었습니다' }
  end

  def public_show
    profile = Profile.find_by!(username: params[:username])
    render json: profile, include: [:links, :portfolio_items, { social_accounts: { include: :posts } }]
  end

  private

  def profile_params
    params.permit(:bio, :avatar_url, :theme_settings, theme_config: {})
  end
end
