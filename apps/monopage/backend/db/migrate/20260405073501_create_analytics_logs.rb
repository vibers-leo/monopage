class CreateAnalyticsLogs < ActiveRecord::Migration[8.1]
  def change
    create_table :analytics_logs do |t|
      t.references :profile, null: false, foreign_key: true
      t.references :link, null: true, foreign_key: true
      t.string :visitor_ip
      t.string :user_agent
      t.string :referrer

      t.timestamps
    end
  end
end
