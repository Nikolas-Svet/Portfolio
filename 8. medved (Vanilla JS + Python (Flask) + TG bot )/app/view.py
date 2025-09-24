from flask.views import MethodView
from flask import render_template, url_for, request, redirect, jsonify
from telegram import Bot, ParseMode
from app.env import chat_id, token


class IndexPage(MethodView):
    def get(self):
        return render_template('pages/index.html')

class AboutUsPage(MethodView):
    def get(self):
        return render_template('pages/about-us.html')


class ServicesPage(MethodView):
    def get(self):
        return render_template('pages/services.html')


class CarsPage(MethodView):
    def get(self):
        return render_template('pages/cars.html')


class ChildrenPage(MethodView):
    def get(self):
        return render_template('pages/children.html')


class ContactFormSendInTgBot(MethodView):
    def post(self):
        token_prod = token
        chat_id_prod = chat_id

        # Получаем данные
        text = request.json

        # Проверка валидности данных
        if not text or not all(k in text for k in ['fullname', 'phone', 'email', 'direction', 'message']):
            return jsonify({"error": "Некорректные данные"}), 400

        try:
            bot = Bot(token=token_prod)
            # Отправляем сообщение

            if len(text['email']) > 0:
                bot.send_message(
                    chat_id=chat_id_prod,
                    text=f"""
                        <b>🔥🔥🔥НОВАЯ ЗАЯВКА🔥🔥🔥</b>\n\n
    📌ФИО: <b>{text['fullname']}</b>\n
    📌Контактный телефон: <b>{text['phone']}</b>\n
    📌Почта: <b>{text['email']}</b>\n
    📌Направление: <b>{text['direction']}</b>\n
    📌Сообщение: <b>{text['message']}</b>
                    """,
                    parse_mode=ParseMode.HTML
                )
            else:
                bot.send_message(
                    chat_id=chat_id_prod,
                    text=f"""
                        <b>🔥🔥🔥НОВАЯ ЗАЯВКА🔥🔥🔥</b>\n\n
    📌ФИО: <b>{text['fullname']}</b>\n
    📌Контактный телефон: <b>{text['phone']}</b>\n
    📌Направление: <b>{text['direction']}</b>\n
    📌Сообщение: <b>{text['message']}</b>
                    """,
                    parse_mode=ParseMode.HTML
                )
            return jsonify({"message": "Заявка успешно отправлена"}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500
