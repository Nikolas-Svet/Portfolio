from smtplib import SMTP  # Импортируем класс SMTP для отправки писем
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from os.path import basename
from jinja2 import Environment, FileSystemLoader


class BaseEmailSender:
    cls_file: str = None

    smtp_host: str = None
    smtp_port: int = None
    smtp_email: str = None
    smtp_login: str = None
    smtp_password: str = None

    def send_email(self, email: str, subject: str, html_content: str, text_content: str = None,
                   files: list[str] = None):
        message = MIMEMultipart()
        message['From'] = self.smtp_email
        message['To'] = email
        message['Subject'] = subject

        if text_content:
            message.attach(MIMEText(text_content, 'plain'))

        # Прикрепляем HTML-контент
        message.attach(MIMEText(html_content, 'html'))

        # Прикрепляем файлы, если они есть
        if files:
            for file_path in files:
                with open(file_path, "rb") as file:
                    part = MIMEApplication(file.read(), Name=basename(file_path))
                part['Content-Disposition'] = f'attachment; filename="{basename(file_path)}"'
                message.attach(part)

        message_text = message.as_string()
        server = SMTP(self.smtp_host, self.smtp_port)
        server.starttls()
        server.login(self.smtp_login, self.smtp_password)
        server.sendmail(self.smtp_email, email, message_text)
        server.quit()

    def render_html_template(self, template_name: str, context: dict) -> str:
        env = Environment(loader=FileSystemLoader('templates/email/'))
        template = env.get_template(template_name)
        return template.render(**context)

