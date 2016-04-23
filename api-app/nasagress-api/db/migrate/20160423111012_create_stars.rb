class CreateStars < ActiveRecord::Migration
  def change
    create_table :stars do |t|
      t.string :name
      t.text :description
      t.decimal :lon, :precision => 9, :scale => 6
      t.decimal :lat, :precision => 9, :scale => 6

      t.timestamps null: false
    end
  end
end
