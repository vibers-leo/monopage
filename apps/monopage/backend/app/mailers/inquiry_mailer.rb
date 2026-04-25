class InquiryMailer < ApplicationMailer
  ADMIN_EMAIL = 'vibers.leo@gmail.com'.freeze

  def new_inquiry(inquiry)
    @inquiry = inquiry
    @profile = inquiry.profile
    @admin_url = "https://monopage.kr/admin?user=#{@profile.username}"
    mail(
      to: ADMIN_EMAIL,
      subject: "[Monopage] 새 문의 — @#{@profile.username}에 #{inquiry.name}님"
    )
  end
end
