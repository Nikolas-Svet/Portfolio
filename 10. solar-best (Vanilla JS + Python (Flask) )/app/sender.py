from app.email_sender import BaseEmailSender
from app.env import smtp_host, smtp_port, smtp_email, smtp_password, smtp_login, smtp_recipient

email_notification_target = smtp_recipient

class EmailSender(BaseEmailSender):
    smtp_host = smtp_host
    smtp_port = smtp_port
    smtp_email = smtp_email
    smtp_login = smtp_login
    smtp_password = smtp_password



