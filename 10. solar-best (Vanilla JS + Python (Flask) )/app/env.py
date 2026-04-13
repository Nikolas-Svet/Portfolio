from dotenv import load_dotenv
import os

load_dotenv()

smtp_host = os.getenv('SMTP_HOST')
smtp_port = int(os.getenv('SMTP_PORT', 587))
smtp_email = os.getenv('SMTP_EMAIL')
smtp_login = os.getenv('SMTP_LOGIN')
smtp_password = os.getenv('SMTP_PASSWORD')
smtp_recipient = os.getenv('SMTP_RECIPIENT')