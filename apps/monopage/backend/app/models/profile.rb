class Profile < ApplicationRecord
  belongs_to :user
  has_many :links, dependent: :destroy
  has_many :portfolio_items, dependent: :destroy
  has_many :social_accounts, dependent: :destroy
  has_many :analytics_logs, dependent: :destroy
  has_many :inquiries, dependent: :destroy
  has_many :posts, through: :social_accounts

  store_accessor :theme_config, :primary_color, :neon_color, :bg_tone
  store_accessor :ai_metadata, :one_liner, :category, :tags

  validates :username, presence: true, uniqueness: true
end
