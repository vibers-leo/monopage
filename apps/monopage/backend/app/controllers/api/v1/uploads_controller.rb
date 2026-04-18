class Api::V1::UploadsController < ApplicationController
  STORAGE_DIR = '/opt/vibers-storage/profiles'.freeze
  PUBLIC_URL  = 'https://storage.vibers.co.kr/profiles'.freeze

  def create
    file = params[:file]
    return render json: { error: '파일이 없습니다' }, status: :bad_request unless file

    ext      = File.extname(file.original_filename).downcase
    allowed  = %w[.jpg .jpeg .png .gif .webp]
    return render json: { error: '허용되지 않는 파일 형식입니다' }, status: :unprocessable_entity unless allowed.include?(ext)

    filename = "#{current_user.id}_#{SecureRandom.hex(8)}#{ext}"
    FileUtils.mkdir_p(STORAGE_DIR)
    File.open("#{STORAGE_DIR}/#{filename}", 'wb') { |f| f.write(file.read) }

    render json: { url: "#{PUBLIC_URL}/#{filename}" }, status: :created
  rescue => e
    Rails.logger.error "Upload error: #{e.message}"
    render json: { error: '업로드 중 오류가 발생했습니다' }, status: :internal_server_error
  end
end
