class User < ApplicationRecord
  has_secure_password validations: false  # 소셜 로그인은 password 없음
  has_one :profile, dependent: :destroy
  has_many :notifications, dependent: :destroy
  after_create :create_profile

  store_accessor :notification_settings, :token_expiry_reminder

  validates :email, uniqueness: { allow_blank: true }
  validates :password, presence: true, if: :email_password_user?
  validates :email, presence: true, if: :email_password_user?

  def email_password_user?
    provider.blank?
  end

  private

  def create_profile
    Profile.create(user: self) unless profile.present?
  end
end
