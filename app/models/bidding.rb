class Bidding < ApplicationRecord
  # Attachments
  has_many_attached :documents

  # Validations
  validates :title, presence: true
  validates :status, inclusion: { in: %w[예정 진행중 제출완료 심사중 선정 탈락] }
  validates :progress, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }

  # Scopes
  scope :by_status, ->(status) { where(status: status) if status.present? }
  scope :recent_first, -> { order(created_at: :desc) }
  scope :by_deadline, -> { order(Arel.sql("deadline IS NULL, deadline ASC")) }

  # Status methods
  def self.status_options
    %w[예정 진행중 제출완료 심사중 선정 탈락]
  end

  def self.status_colors
    {
      "예정" => "gray",
      "진행중" => "blue",
      "제출완료" => "yellow",
      "심사중" => "purple",
      "선정" => "green",
      "탈락" => "red"
    }
  end

  def status_color
    self.class.status_colors[status] || "gray"
  end

  def progress_color
    case progress
    when 0...30
      "red"
    when 30...70
      "yellow"
    when 70...90
      "blue"
    else
      "green"
    end
  end

  # 제안서 아웃라인 자동 생성
  def generate_proposal_outline
    template = <<~OUTLINE
      # #{title} 제안서 아웃라인

      ## Ⅰ. 제안 개요 (Why & Concept)
      ### 1. 사업의 이해
      - 발주처: #{agency}
      - 예산 규모: #{budget}
      - 사업 목적 및 배경

      ### 2. 핵심 추진 전략
      - 전략 1: [RFP 분석 기반]
      - 전략 2: [차별화 포인트]
      - 전략 3: [리스크 관리]

      ## Ⅱ. 사업 수행 계획 (What & How)
      ### 3. 총괄 운영 계획
      - 사업 기간: #{application_period}
      - 추진 체계
      - 일정 관리

      ### 4. 세부 프로그램 기획
      - 프로그램 1:
      - 프로그램 2:
      - 프로그램 3:

      ### 5. 공간 및 시설 계획
      - 동선 계획
      - 시설 배치
      - 시스템 구성

      ## Ⅲ. 홍보 및 안전 관리
      ### 6. 홍보 마케팅 전략
      - 온라인 채널 활용
      - 오프라인 홍보
      - SNS 바이럴

      ### 7. 안전 관리 계획
      - 안전 요원 배치
      - 비상 대응 체계
      - 보험 가입

      ### 8. 민원 대응
      - 민원 접수 체계
      - 사후 관리 방안

      ## Ⅳ. 조직 및 기대효과
      ### 9. 조직 구성 및 인력 계획
      - 총괄 PM:
      - 세부 담당자:
      - 협력 업체: #{partner}

      ### 10. 기대 효과
      - 정량적 효과
      - 정성적 효과
      - 지역 경제 기여

      ---

      💡 **제안 포인트**
      #{winning_strategy.present? ? winning_strategy : "- NotebookLM 분석 결과를 여기에 추가하세요"}
    OUTLINE

    self.proposal_outline = template
    save
  end
end
