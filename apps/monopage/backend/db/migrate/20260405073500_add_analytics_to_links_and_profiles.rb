class AddAnalyticsToLinksAndProfiles < ActiveRecord::Migration[8.1]
  def change
    add_column :links, :clicks_count, :integer, default: 0
    add_column :profiles, :views_count, :integer, default: 0
  end
end
