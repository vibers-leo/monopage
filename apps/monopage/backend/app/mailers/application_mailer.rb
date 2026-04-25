class ApplicationMailer < ActionMailer::Base
  default from: ENV.fetch("SMTP_FROM", "Monopage <vibers.leo@gmail.com>")
  layout "mailer"
end
