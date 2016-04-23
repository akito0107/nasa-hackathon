class Star < ActiveRecord::Base
  #self.rgeo_factory_generator = RGeo::Geos.method(:factory)
  # But use a geographic implementation for the :latlon column.
  #set_rgeo_factory_for_column(:latlon, RGeo::Geographic.spherical_factory)

  scope :near_star, ->(lon, lat) { find_by_sql(['select id, name, description, blue_score, red_score, team_id, lat, lon from stars where MBRContains(GeomFromText("LineString( ? ? , ? ?)"), latlon)', lon + 0.5, lat + 0.5, lon - 0.2, lat - 0.2])
  }

end
