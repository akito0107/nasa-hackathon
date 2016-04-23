json.array!(@scores) do |score|
  json.extract! score, :id, :star_id, :team_id, :count
  json.url score_url(score, format: :json)
end
