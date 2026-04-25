class Notification < ApplicationRecord
  belongs_to :user

  scope :unread, -> { where(read: false) }
  scope :recent, -> { order(created_at: :desc) }

  # type_key: new_inquiry, milestone_views, page_created, page_request
end
