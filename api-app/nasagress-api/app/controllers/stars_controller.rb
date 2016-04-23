class StarsController < ApplicationController
  before_action :set_star, only: [:edit, :update, :destroy]

  # GET /stars
  # GET /stars.json
  def index
    @stars = Star.all
    render :json => @stars
  end

  def main
    #lon = params[:lon]
    #lat = params[:lat]
    # @stars = Star.join_score.to_json(include: {score: {only: :team_id}})
    @stars = Star.all
    render :json => { :stars => @stars, :scores => @scores}
  end

  def hack
    star = Star.find(params[:star_id])
    team = Team.find(params[:team_id])

    if team.color == 'blue' then
      if star.red_score > 0 then
        star.red_score - 1
      else
        star.blue_score + 1
      end
    elsif team.color == 'red' then
      if star.blue_score > 0 then
        star.blue_score - 1
      else
        star.red_score + 1
      end
    end

    changed = false

    if star.red_score == 0 && star.blue_score == 0 then
        star.team_id = team.id
        changed = true
    end
    star.save
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
