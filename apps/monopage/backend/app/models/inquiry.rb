class Inquiry < ApplicationRecord
  belongs_to :profile

  validates :name, presence: true
  validates :message, presence: true
  validates :status, inclusion: { in: %w[received checked completed] }

  scope :recent, -> { order(created_at: :desc) }
end
