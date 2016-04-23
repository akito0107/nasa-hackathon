json.array!(@constellations) do |constellation|
  json.extract! constellation, :id, :name
  json.url constellation_url(constellation, format: :json)
end
