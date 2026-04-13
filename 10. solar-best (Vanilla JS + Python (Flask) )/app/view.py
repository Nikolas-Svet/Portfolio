from flask.views import MethodView
from flask import render_template, url_for, request, redirect, jsonify
from app.sender import EmailSender, email_notification_target


class IndexPage(MethodView):
    def get(self):
        return render_template('pages/index.html')


class InfoPage(MethodView):
    def get(self):
        return render_template('pages/imprint.html')


class AgbPage(MethodView):
    def get(self):
        return render_template('pages/agb.html')

class DatenschutzPage(MethodView):
    def get(self):
        return render_template('pages/datenschutz.html')


class SendEmail(MethodView):
    def post(self):
        try:
            data = request.get_json()

            html_content = EmailSender().render_html_template('email_template.html', data)

            EmailSender().send_email(
                email=email_notification_target,
                subject=f"Ein neuer Antrag auf Beratung von {data['surname']} {data['name']}",
                html_content=html_content
            )

            return jsonify({"status": "send"}), 200

        except KeyError as e:
            return jsonify({"status": "error_key", "message": f"Missing key: {str(e)}"}), 400

        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500
