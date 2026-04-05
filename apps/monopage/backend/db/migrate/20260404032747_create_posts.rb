class CreatePosts < ActiveRecord::Migration[8.1]
  def change
    create_table :posts do |t|
      t.references :social_account, null: false, foreign_key: true
      t.string :external_id
      t.string :media_url
      t.string :permalink
      t.text :caption
      t.datetime :published_at
      t.string :media_type

      t.timestamps
    end
  end
end
