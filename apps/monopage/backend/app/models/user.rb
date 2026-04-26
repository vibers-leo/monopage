class User < ApplicationRecord
  has_secure_password validations: false  # 소셜 로그인은 password 없음
  has_many :profiles, dependent: :destroy
  has_one :profile, -> { order(created_at: :asc) } # 기본 프로필 (하위 호환)
  has_many :notifications, dependent: :destroy
  after_create :create_first_profile

  store_accessor :notification_settings, :token_expiry_reminder

  validates :email, uniqueness: { allow_blank: true }
  validates :password, presence: true, if: :email_password_user?
  validates :email, presence: true, if: :email_password_user?

  def email_password_user?
    provider.blank?
  end

  private

  def create_first_profile
    profiles.create unless profiles.exists?
  end
end
