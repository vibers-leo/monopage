class CreateLinks < ActiveRecord::Migration[8.1]
  def change
    create_table :links do |t|
      t.references :profile, null: false, foreign_key: true
      t.string :title
      t.string :url
      t.string :icon_type
      t.integer :position

      t.timestamps
    end
  end
end
