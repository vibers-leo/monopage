class InquiryMailer < ApplicationMailer
  SUPER_ADMIN_EMAIL = 'vibers.leo@gmail.com'.freeze

  def new_inquiry(inquiry)
    @inquiry = inquiry
    @profile = inquiry.profile
    @owner = @profile.user
    @admin_url = "https://monopage.kr/admin"

    # 페이지 주인에게 발송, 슈퍼어드민은 CC
    owner_email = @owner&.email
    recipients = [owner_email].compact
    cc = owner_email != SUPER_ADMIN_EMAIL ? [SUPER_ADMIN_EMAIL] : []

    mail(
      to: recipients,
      cc: cc,
      subject: "[Monopage] @#{@profile.username}에 새 문의가 들어왔어요"
    )
  end
end
