class PasswordResetMailer < ApplicationMailer
  def reset_email(user, token)
    @user = user
    @reset_url = "#{ENV['FRONTEND_URL'] || 'https://monopage.kr'}/reset-password?token=#{token}"
    mail(to: user.email, subject: '[Monopage] 비밀번호 재설정')
  end
end
