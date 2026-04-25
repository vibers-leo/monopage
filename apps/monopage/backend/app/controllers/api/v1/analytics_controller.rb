class Api::V1::AnalyticsController < ApplicationController
  skip_before_action :authorized, only: [:track_view, :track_click, :stats]

  def index
    profile = current_user.profile
    logs = profile.analytics_logs

    # 총 조회수
    total_views = logs.where(link_id: nil).count
    today_views = logs.where(link_id: nil).where('created_at >= ?', Time.zone.now.beginning_of_day).count

    # 최근 7일 일별 조회수
    daily = logs.where(link_id: nil)
               .where('created_at >= ?', 7.days.ago.beginning_of_day)
               .group("DATE(created_at)")
               .count
               .transform_keys(&:to_s)

    # 링크별 클릭수 (상위 10)
    link_clicks = logs.where.not(link_id: nil)
                      .group(:link_id)
                      .count
                      .sort_by { |_, v| -v }
                      .first(10)
                      .map { |link_id, count| { link_id: link_id, clicks: count, title: profile.links.find_by(id: link_id)&.title } }

    # 총 링크 클릭수
    total_clicks = logs.where.not(link_id: nil).count

    render json: {
      total_views: total_views,
      today_views: today_views,
      total_clicks: total_clicks,
      daily: daily,
      link_clicks: link_clicks,
    }
  end

  # 퍼블릭: 전체 통계 (홈 랜딩용)
  def stats
    render json: { pages: Profile.count, views: AnalyticsLog.where(link_id: nil).count }
  end

  # 퍼블릭: 페이지 조회 로그
  def track_view
    profile = Profile.find_by(id: params[:profile_id])
    return head :not_found unless profile

    profile.analytics_logs.create(
      visitor_ip: request.remote_ip,
      user_agent: request.user_agent,
      referrer: request.referer,
    )
    profile.increment!(:views_count)
    head :ok
  end

  # 퍼블릭: 링크 클릭 로그
  def track_click
    profile = Profile.find_by(id: params[:profile_id])
    link = profile&.links&.find_by(id: params[:link_id])
    return head :not_found unless link

    profile.analytics_logs.create(
      link_id: link.id,
      visitor_ip: request.remote_ip,
      user_agent: request.user_agent,
      referrer: request.referer,
    )
    link.increment!(:clicks_count)
    head :ok
  end
end
