class Api::V1::InquiriesController < ApplicationController
  skip_before_action :authorized, only: [:create]
  before_action :set_inquiry, only: [:update, :destroy]

  # GET /api/v1/inquiries — 내 프로필에 들어온 문의 목록
  def index
    profile = current_user.profile
    inquiries = profile.inquiries.recent
    inquiries = inquiries.where(status: params[:status]) if params[:status].present?
    render json: inquiries
  end

  # POST /api/v1/inquiries — 공개 문의 생성 (인증 불필요)
  def create
    profile = Profile.find_by(id: params[:profile_id]) || Profile.find_by(username: params[:username])
    return render json: { error: '페이지를 찾을 수 없어요' }, status: :not_found unless profile

    inquiry = profile.inquiries.build(inquiry_params)
    if inquiry.save
      # 메일 알림
      InquiryMailer.new_inquiry(inquiry).deliver_now rescue nil
      # 인앱 알림
      profile.user.notifications.create(
        type_key: 'new_inquiry',
        title: "#{inquiry.name}님이 문의를 보냈어요",
        body: inquiry.message.truncate(80),
        metadata: { inquiry_id: inquiry.id, name: inquiry.name }
      ) rescue nil
      render json: inquiry, status: :created
    else
      render json: { errors: inquiry.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH /api/v1/inquiries/:id — 상태 변경, 메모 추가
  def update
    if @inquiry.update(update_params)
      render json: @inquiry
    else
      render json: { errors: @inquiry.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/inquiries/:id
  def destroy
    @inquiry.destroy
    head :no_content
  end

  # GET /api/v1/inquiries/stats — 문의 통계
  def stats
    profile = current_user.profile
    total = profile.inquiries.count
    received = profile.inquiries.where(status: 'received').count
    today = profile.inquiries.where('created_at >= ?', Time.current.beginning_of_day).count
    render json: { total: total, received: received, today: today }
  end

  private

  def set_inquiry
    @inquiry = current_user.profile.inquiries.find(params[:id])
  end

  def inquiry_params
    params.permit(:name, :email, :phone, :message)
  end

  def update_params
    params.permit(:status, :admin_note)
  end
end
