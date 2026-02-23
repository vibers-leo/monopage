class Admin::BiddingsController < ApplicationController
  before_action :set_bidding, only: [:show, :edit, :update, :destroy, :generate_proposal]
  layout 'admin'

  def index
    @biddings = Bidding.all
    @biddings = @biddings.by_status(params[:status]) if params[:status].present?
    @biddings = @biddings.by_deadline

    # Stats
    @stats = {
      total: Bidding.count,
      scheduled: Bidding.where(status: "예정").count,
      in_progress: Bidding.where(status: "진행중").count,
      submitted: Bidding.where(status: "제출완료").count,
      selected: Bidding.where(status: "선정").count
    }
  end

  def show
  end

  def new
    @bidding = Bidding.new
  end

  def create
    @bidding = Bidding.new(bidding_params)

    if @bidding.save
      redirect_to admin_biddings_path, notice: '입찰사업이 추가되었습니다.'
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @bidding.update(bidding_params)
      redirect_to admin_bidding_path(@bidding), notice: '입찰사업이 수정되었습니다.'
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @bidding.destroy
    redirect_to admin_biddings_path, notice: '입찰사업이 삭제되었습니다.'
  end

  def generate_proposal
    @bidding.generate_proposal_outline
    redirect_to admin_bidding_path(@bidding), notice: '제안서 아웃라인이 생성되었습니다.'
  end

  private

  def set_bidding
    @bidding = Bidding.find(params[:id])
  end

  def bidding_params
    params.require(:bidding).permit(
      :title, :agency, :application_period, :budget, :status,
      :progress, :assignee, :description, :deadline, :partner,
      :analysis_notes, :proposal_outline, :winning_strategy,
      documents: []
    )
  end
end
