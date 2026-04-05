class Sns::TokenRefreshWorker
  include Sidekiq::Worker
  sidekiq_options retry: 1

  def perform
    # IG: Refresh if expiring in less than 10 days
    SocialAccount.where(provider: 'instagram')
                 .where('expires_at < ?', 10.days.from_now)
                 .find_each do |acc|
      Sns::TokenManagerService.new(acc).refresh
    end

    # YT: Check if status is invalid or expired
    SocialAccount.where(provider: 'youtube', status: :expired).find_each do |acc|
      Sns::TokenManagerService.new(acc).refresh
    end
  end
end
