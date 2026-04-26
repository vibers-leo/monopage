class Api::V1::PortfolioItemsController < ApplicationController
  def index
    render json: current_user.profile.portfolio_items
  end

  def create
    item = current_user.profile.portfolio_items.new(portfolio_item_params)
    item.position ||= current_user.profile.portfolio_items.count
    if item.save
      render json: item, status: :created
    else
      render json: { errors: item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    item = current_user.profile.portfolio_items.find(params[:id])
    if item.update(portfolio_item_params)
      render json: item
    else
      render json: { errors: item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    item = current_user.profile.portfolio_items.find(params[:id])
    item.destroy
    head :no_content
  end

  def reorder
    ids = params[:ids]
    ids.each_with_index do |id, index|
      current_user.profile.portfolio_items.where(id: id).update_all(position: index)
    end
    render json: current_user.profile.portfolio_items.reload
  end

  private

  def portfolio_item_params
    params.permit(:image_url, :video_url, :media_type, :permalink, :title, :description, :category, :position, :pinned, :source)
  end
end
