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
      # Mocking Instagram API response
      mock_posts = [
        { id: 'ig_1', media_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113', permalink: 'https://instagr.am/p/1', caption: 'Summer Vibes ☀️', media_type: 'IMAGE', timestamp: Time.current },
        { id: 'ig_2', media_url: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0', permalink: 'https://instagr.am/p/2', caption: 'Deep Workspace', media_type: 'IMAGE', timestamp: 1.day.ago }
      ]

      mock_posts.each do |p|
        post = @social_account.posts.find_or_initialize_by(external_id: p[:id])
        post.data = {
          media_url: p[:media_url],
          permalink: p[:permalink],
          caption: p[:caption]
        }
        post.media_type = p[:media_type]
        post.published_at = p[:timestamp]
        post.save!
      end
    end

    def sync_youtube
      # Mocking YouTube API response
      mock_videos = [
        { id: 'yt_1', media_url: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb', permalink: 'https://youtube.com/v/1', caption: 'Next.js Tutorial', media_type: 'VIDEO', timestamp: 2.days.ago }
      ]

      mock_videos.each do |v|
        post = @social_account.posts.find_or_initialize_by(external_id: v[:id])
        post.data = {
          media_url: v[:media_url],
          permalink: v[:permalink],
          caption: v[:caption]
        }
        post.media_type = 'VIDEO'
        post.published_at = v[:timestamp]
        post.save!
      end
    end
  end
end
