class Api::V1::PasswordResetsController < ApplicationController
  skip_before_action :authorized

  def create
    user = User.find_by(email: params[:email]&.downcase)
    if user && user.provider.blank?
      token = SecureRandom.urlsafe_base64(32)
      user.update_columns(
        password_reset_token: token,
        password_reset_sent_at: Time.current
      )
      PasswordResetMailer.reset_email(user, token).deliver_now rescue nil
    end
    render json: { message: '이메일이 등록되어 있다면 재설정 링크를 보냈어요' }
  end

  def update
    user = User.find_by(password_reset_token: params[:token])
    if user.nil? || user.password_reset_sent_at < 2.hours.ago
      return render json: { error: '링크가 만료되었거나 유효하지 않아요' }, status: :unprocessable_entity
    end
    if params[:password].blank? || params[:password].length < 6
      return render json: { error: '비밀번호는 6자 이상이어야 해요' }, status: :unprocessable_entity
    end
    user.update!(
      password: params[:password],
      password_reset_token: nil,
      password_reset_sent_at: nil
    )
    render json: { message: '비밀번호를 변경했어요. 다시 로그인해주세요.' }
  end
end
