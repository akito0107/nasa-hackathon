json.array!(@stars) do |star|
  json.extract! star, :id, :name, :description, :lon, :lat
  json.url star_url(star, format: :json)
end
