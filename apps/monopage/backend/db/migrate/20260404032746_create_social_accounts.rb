class CreateSocialAccounts < ActiveRecord::Migration[8.1]
  def change
    create_table :social_accounts do |t|
      t.references :profile, null: false, foreign_key: true
      t.string :provider
      t.string :access_token
      t.string :refresh_token
      t.string :uid
      t.jsonb :metadata

      t.timestamps
    end
  end
end
