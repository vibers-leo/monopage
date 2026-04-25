class AddKnowledgeMdToProfiles < ActiveRecord::Migration[7.1]
  def change
    add_column :profiles, :knowledge_md, :text unless column_exists?(:profiles, :knowledge_md)
  end
end
