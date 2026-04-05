module Sns
  class TokenManagerService
    def initialize(social_account)
      @social_account = social_account
    end

    def refresh
      case @social_account.provider
      when 'instagram'
        refresh_instagram
      when 'youtube'
        refresh_youtube
      end
    end

    private

    def refresh_instagram
      # Mocking IG Refresh: GET /refresh_access_token?grant_type=ig_refresh_token&access_token=...
      # In reality, this would use HTTParty/Faraday
      new_token = "refreshed_ig_#{SecureRandom.hex(10)}"
      @social_account.update!(
        access_token: new_token,
        expires_at: 60.days.from_now,
        status: :active
      )
    end

    def refresh_youtube
      # Mocking YT Refresh using refresh_token
      new_token = "refreshed_yt_#{SecureRandom.hex(10)}"
      @social_account.update!(
        access_token: new_token,
        expires_at: 1.hour.from_now, # YT access tokens are short-lived
        status: :active
      )
    end
  end
end
