class Post < ApplicationRecord
  belongs_to :social_account

  store_accessor :data, :media_url, :permalink, :caption
end
