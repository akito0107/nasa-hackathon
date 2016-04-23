class CreateTeams < ActiveRecord::Migration
  def change
    create_table :teams do |t|
      t.string :name
      t.string :color
      t.integer :score

      t.timestamps null: false
    end
  end
end
