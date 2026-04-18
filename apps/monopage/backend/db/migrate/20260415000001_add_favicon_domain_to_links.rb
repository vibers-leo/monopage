class AddFaviconDomainToLinks < ActiveRecord::Migration[8.0]
  def change
    add_column :links, :favicon, :string
    add_column :links, :domain, :string
  end
end
