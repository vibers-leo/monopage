class Api::V1::NotificationsController < ApplicationController
  skip_before_action :authorized, only: [:create]

  def create
    case params[:type]
    when 'page_request'
      AdminMailer.page_request(
        username: params.dig(:data, :username),
        purpose: params.dig(:data, :purpose),
        email: params.dig(:data, :email)
      ).deliver_now
    end
    render json: { ok: true }
  rescue => e
    Rails.logger.error "Notification error: #{e.message}"
    render json: { ok: true }
  end
end
