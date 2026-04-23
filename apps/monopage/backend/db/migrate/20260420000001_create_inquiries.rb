class CreateInquiries < ActiveRecord::Migration[7.1]
  def change
    create_table :inquiries do |t|
      t.references :profile, null: false, foreign_key: true
      t.string :name, null: false
      t.string :email
      t.string :phone
      t.text :message, null: false
      t.string :status, default: 'received'
      t.text :admin_note
      t.timestamps
    end

    add_index :inquiries, :status
    add_index :inquiries, :created_at
  end
end
