class Api::V1::UserNotificationsController < ApplicationController
  # GET /api/v1/notifications
  def index
    notifications = current_user.notifications.recent.limit(30)
    render json: {
      notifications: notifications,
      unread_count: current_user.notifications.unread.count
    }
  end

  # PATCH /api/v1/notifications/:id/read
  def read
    notification = current_user.notifications.find(params[:id])
    notification.update!(read: true)
    render json: notification
  end

  # POST /api/v1/notifications/read_all
  def read_all
    current_user.notifications.unread.update_all(read: true)
    render json: { ok: true }
  end
end
