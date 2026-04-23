class AddPinnedAndSourceToPortfolioItems < ActiveRecord::Migration[7.1]
  def change
    add_column :portfolio_items, :pinned, :boolean, default: false unless column_exists?(:portfolio_items, :pinned)
    add_column :portfolio_items, :source, :string, default: 'manual' unless column_exists?(:portfolio_items, :source)
  end
end
