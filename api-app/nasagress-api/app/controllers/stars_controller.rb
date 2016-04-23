require 'date'
class StarsController < ApplicationController
  before_action :set_star, only: [:edit, :update, :destroy]

  # GET /stars
  # GET /stars.json
  def index
    @stars = Star.all
    render :json => @stars
  end

  def main
    #基準日と基準日の春分点
    baseLongtitude = 112.5
    baseDay = Time.gm(2016, 03, 20, 04, 30, 00)

    #UTC における現在時刻
    currentDay = Time.now.utc

    #現在時刻と基準日の差の秒
    difSec = currentDay - baseDay
    #公転の影響による基準点との角度の差(東へ移動)
    revolutionAngle = difSec / 87600

    #現在時刻と基準日の差
    difDailyMin = (currentDay.hour - baseDay.hour)*60 + currentDay.min - baseDay.min
    #自転の影響による基準点との角度の差(西へ移動)
    rotationAngle = difDailyMin / 4.0

    #現在時刻における春分点の経度(緯度は0で固定)
    equixLongtitude = baseLongtitude - revolutionAngle + rotationAngle

    lon = params[:lon].to_f - equixLongtitude
    lat = params[:lat].to_f
    lon = roundLongitude(lon)
    # @stars = Star.join_score.to_json(include: {score: {only: :team_id}})
    @stars = Star.near_star(lon, lat)
    @stars.map! {|lon|roundLongitude(lon.to_f + equixLongtitude)}
    render :json => { :stars => @stars, :scores => @scores}
  end

  def hack
    star = Star.find(params[:star_id])
    red = Team.find_by_color('red')
    blue = Team.find_by_color('blue')

    if team.color == 'blue' then
      if star.red_score > 0 then
        star.red_score -= 1
      else
        star.blue_score += 1
      end
      blue.score += 1
      red.score -= 1
    elsif team.color == 'red' then
      if star.blue_score > 0 then
        star.blue_score -= 1
      else
        star.red_score += 1
        team.score += 1
      end
      red.score += 1
      blue.score -= 1
    end

    changed = false

    if star.red_score == 0 && star.blue_score == 0 then
        star.team_id = team.id
        changed = true
    end
    red.save!
    blue.save!
    star.save!
    render :json => {:star => star, :changed => changed}
  end

  # GET /stars/1
  # GET /stars/1.json
  def show
    @star = Star.find(params[:id])
    render :json => @star
  end

  # GET /stars/new
  def new
    @star = Star.new
  end

  # GET /stars/1/edit
  def edit
  end

  # POST /stars
  # POST /stars.json
  def create
    @star = Star.new(star_params)

    respond_to do |format|
      if @star.save
        format.html { redirect_to @star, notice: 'Star was successfully created.' }
        format.json { render :show, status: :created, location: @star }
      else
        format.html { render :new }
        format.json { render json: @star.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /stars/1
  # PATCH/PUT /stars/1.json
  def update
    respond_to do |format|
      if @star.update(star_params)
        format.html { redirect_to @star, notice: 'Star was successfully updated.' }
        format.json { render :show, status: :ok, location: @star }
      else
        format.html { render :edit }
        format.json { render json: @star.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /stars/1
  # DELETE /stars/1.json
  def destroy
    @star.destroy
    respond_to do |format|
      format.html { redirect_to stars_url, notice: 'Star was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def roundLongitude(val)
    if val > 180
      val -= 360
    elsif val < -180
      val += 360
    end
    val
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_star
      @star = Star.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def star_params
      params.require(:star).permit(:name, :description, :lon, :lat)
    end

end
