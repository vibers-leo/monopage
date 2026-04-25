class Link < ApplicationRecord
  belongs_to :profile
  has_many :analytics_logs, dependent: :nullify
end
