class CreateNotifications < ActiveRecord::Migration[7.1]
  def change
    create_table :notifications do |t|
      t.references :user, null: false, foreign_key: true
      t.string :type_key, null: false
      t.string :title, null: false
      t.text :body
      t.jsonb :metadata, default: {}
      t.boolean :read, default: false
      t.timestamps
    end
    add_index :notifications, [:user_id, :read]
    add_index :notifications, :created_at
  end
end
