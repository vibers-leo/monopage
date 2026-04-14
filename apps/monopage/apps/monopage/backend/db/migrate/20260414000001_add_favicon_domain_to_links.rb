class AddFaviconDomainToLinks < ActiveRecord::Migration[8.1]
  def change
    add_column :links, :favicon, :string
    add_column :links, :domain, :string
  end
end
