class Sns::SyncWorker
  include Sidekiq::Worker
  sidekiq_options retry: 3

  def perform(social_account_id)
    social_account = SocialAccount.find(social_account_id)
    Sns::SyncService.new(social_account).sync
  end
end
