class CreateProfiles < ActiveRecord::Migration[8.1]
  def change
    create_table :profiles do |t|
      t.references :user, null: false, foreign_key: true
      t.string :username
      t.text :bio
      t.string :avatar_url
      t.jsonb :theme_settings

      t.timestamps
    end
  end
end
