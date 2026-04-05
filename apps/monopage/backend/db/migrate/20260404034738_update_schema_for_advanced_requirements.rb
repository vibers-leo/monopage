class UpdateSchemaForAdvancedRequirements < ActiveRecord::Migration[8.1]
  def change
    # Users
    add_column :users, :notification_settings, :jsonb, default: {}

    # Profiles
    add_column :profiles, :theme_config, :jsonb, default: {}
    add_column :profiles, :ai_metadata, :jsonb, default: {}

    # Social Accounts
    add_column :social_accounts, :expires_at, :datetime
    add_column :social_accounts, :status, :integer, default: 0

    # Posts (Normalization)
    remove_column :posts, :media_url, :string
    remove_column :posts, :permalink, :string
    remove_column :posts, :caption, :text
    add_column :posts, :data, :jsonb, default: {}
    add_column :posts, :position, :integer
  end
end
