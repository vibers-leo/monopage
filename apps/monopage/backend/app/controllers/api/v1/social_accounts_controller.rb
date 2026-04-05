class Api::V1::SocialAccountsController < ApplicationController
  def index
    render json: current_user.profile.social_accounts, include: :posts
  end

  def create
    social_account = current_user.profile.social_accounts.find_or_create_by!(
      provider: params[:provider],
      uid: params[:uid]
    ) do |sa|
      sa.access_token = params[:access_token]
      sa.refresh_token = params[:refresh_token]
      sa.metadata = params[:metadata]
    end

    render json: social_account, status: :created
  end

  def sync
    social_account = current_user.profile.social_accounts.find(params[:id])
    posts = Sns::SyncService.new(social_account).sync
    render json: { message: "Synced #{posts.count} items", posts: posts }
  end

  def destroy
    social_account = current_user.profile.social_accounts.find(params[:id])
    social_account.destroy
    head :no_content
  end
end
