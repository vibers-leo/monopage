class Api::V1::Admin::SuperController < ApplicationController
  before_action :require_super_admin
  before_action :set_target_profile, except: [:all_inquiries, :all_profiles]

  SUPER_ADMIN_EMAILS = %w[
    juuuno@naver.com
    juuuno1116@gmail.com
    designd@designd.co.kr
    designdlab@designdlab.co.kr
    vibers.leo@gmail.com
  ].freeze

  # GET /api/v1/admin/profiles/:username
  def profile
    render json: @target_profile.as_json(
      include: { user: { only: [:id, :email, :provider] } },
      methods: []
    ).merge(
      links_count: @target_profile.links.count,
      portfolio_count: @target_profile.portfolio_items.count,
      inquiries_count: @target_profile.inquiries.count
    )
  end

  # GET /api/v1/admin/profiles/:username/links
  def links
    render json: @target_profile.links.order(:position)
  end

  # GET /api/v1/admin/profiles/:username/portfolio_items
  def portfolio_items
    render json: @target_profile.portfolio_items.order(:position)
  end

  # GET /api/v1/admin/profiles/:username/inquiries
  def inquiries
    render json: @target_profile.inquiries.recent
  end

  # PATCH /api/v1/admin/profiles/:username
  def update_profile
    if @target_profile.update(admin_profile_params)
      render json: @target_profile
    else
      render json: { errors: @target_profile.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # GET /api/v1/admin/all_inquiries — 전체 문의 (최신순)
  def all_inquiries
    inquiries = Inquiry.includes(:profile).recent.limit(100)
    render json: inquiries.map { |i|
      i.as_json.merge(profile_username: i.profile.username)
    }
  end

  # GET /api/v1/admin/all_profiles — 전체 프로필 목록
  def all_profiles
    profiles = Profile.includes(:user, :links, :inquiries).order(created_at: :desc)
    render json: profiles.map { |p|
      {
        id: p.id,
        username: p.username,
        bio: p.bio,
        avatar_url: p.avatar_url,
        email: p.user&.email,
        provider: p.user&.provider,
        links_count: p.links.size,
        inquiries_count: p.inquiries.size,
        views_count: p.views_count || 0,
        created_at: p.created_at
      }
    }
  end

  private

  def require_super_admin
    unless current_user && SUPER_ADMIN_EMAILS.include?(current_user.email)
      render json: { error: '접근 권한이 없어요' }, status: :forbidden
    end
  end

  def set_target_profile
    @target_profile = Profile.find_by!(username: params[:username])
  end

  def admin_profile_params
    params.permit(:bio, :avatar_url, :username, :theme_config)
  end
end
