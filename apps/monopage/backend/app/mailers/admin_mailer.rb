class AdminMailer < ApplicationMailer
  SUPER_ADMIN_EMAIL = 'vibers.leo@gmail.com'.freeze

  def page_request(data)
    @username = data[:username]
    @purpose = data[:purpose]
    @email = data[:email]
    mail(
      to: SUPER_ADMIN_EMAIL,
      subject: "[Monopage] 추가 페이지 개설 신청 — #{@username}"
    )
  end
end
