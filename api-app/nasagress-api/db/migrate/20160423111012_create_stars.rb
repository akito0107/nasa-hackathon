class CreateStars < ActiveRecord::Migration
  def change
    create_table :stars do |t|
      t.string :name
      t.text :description
      t.integer :constellation_id
      t.decimal :lon, :precision => 9, :scale => 6
      t.decimal :lat, :precision => 9, :scale => 6
      t.integer :blue_score
      t.integer :red_score
      t.integer :team_id

      t.timestamps null: false
    end
  end
end
