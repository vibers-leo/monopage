class SocialAccount < ApplicationRecord
  belongs_to :profile
  has_many :posts, dependent: :destroy

  enum :provider, { instagram: "instagram", facebook: "facebook", threads: "threads", youtube: "youtube" }
  enum :status, { active: 0, expired: 1, reauth_required: 2 }
end
