class AddVideoAndPermalinkToPortfolioItems < ActiveRecord::Migration[7.1]
  def change
    add_column :portfolio_items, :video_url, :string unless column_exists?(:portfolio_items, :video_url)
    add_column :portfolio_items, :media_type, :string, default: 'image' unless column_exists?(:portfolio_items, :media_type)
    add_column :portfolio_items, :permalink, :string unless column_exists?(:portfolio_items, :permalink)
  end
end
