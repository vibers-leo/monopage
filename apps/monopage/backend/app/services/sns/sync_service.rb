require 'net/http'
require 'json'

module Sns
  class SyncService
    def initialize(social_account)
      @social_account = social_account
    end

    def sync
      case @social_account.provider
      when 'instagram'
        sync_instagram
      when 'youtube'
        sync_youtube
      end
    end

    private

    def sync_instagram
      token = @social_account.access_token
      return unless token.present?

      uri = URI("https://graph.instagram.com/v21.0/me/media?fields=id,caption,media_url,permalink,timestamp,media_type,thumbnail_url&limit=20&access_token=#{token}")
      response = Net::HTTP.get_response(uri)

      unless response.is_a?(Net::HTTPSuccess)
        Rails.logger.error "Instagram sync failed: #{response.body}"
        @social_account.update(status: :reauth_required) if response.code == '190' || response.body.include?('OAuthException')
        return
      end

      data = JSON.parse(response.body)
      posts = data['data'] || []

      posts.each_with_index do |p, i|
        post = @social_account.posts.find_or_initialize_by(external_id: p['id'])
        post.data = {
          media_url: p['media_url'] || p['thumbnail_url'],
          permalink: p['permalink'],
          caption: p['caption'],
        }
        post.media_type = p['media_type']
        post.published_at = p['timestamp']
        post.position = i
        post.save!
      end

      @social_account.update(status: :active)
    end

    def sync_youtube
      # YouTube Data API 연동 (추후 구현)
    end
  end
end
