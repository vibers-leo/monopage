class User < ApplicationRecord
  has_secure_password
  has_one :profile, dependent: :destroy
  after_create :create_profile

  store_accessor :notification_settings, :token_expiry_reminder

  private

  def create_profile
    Profile.create(user: self)
  end

  validates :email, presence: true, uniqueness: true
end
