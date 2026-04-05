class Api::V1::LinksController < ApplicationController
  def index
    render json: current_user.profile.links
  end

  def create
    link = current_user.profile.links.new(link_params)
    if link.save
      render json: link, status: :created
    else
      render json: { errors: link.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    link = current_user.profile.links.find(params[:id])
    if link.update(link_params)
      render json: link
    else
      render json: { errors: link.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    link = current_user.profile.links.find(params[:id])
    link.destroy
    head :no_content
  end

  private

  def link_params
    params.permit(:title, :url, :icon_type, :position)
  end
end
