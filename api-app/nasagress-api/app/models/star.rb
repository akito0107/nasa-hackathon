class Star < ActiveRecord::Base
  has_one :score

  def as_json(options)
    options = { include: {score: {only: :team_id}}}.merge(options)
    super(options)
  end
end
