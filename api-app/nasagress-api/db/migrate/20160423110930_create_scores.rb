class CreateScores < ActiveRecord::Migration
  def change
    create_table :scores do |t|
      t.integer :star_id
      t.integer :team_id
      t.integer :count

      t.timestamps null: false
    end
  end
end
