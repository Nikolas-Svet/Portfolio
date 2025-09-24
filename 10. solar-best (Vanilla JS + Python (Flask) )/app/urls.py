from app.view import IndexPage, SendEmail, InfoPage, AgbPage, DatenschutzPage
from flask import Flask



URLS = {
    '/': (IndexPage, 'index'),
    '/send-email/': (SendEmail, 'send_email'),
    '/imprint/': (InfoPage, 'imprint'),
    '/agb/': (AgbPage, 'agb'),
    '/data-protection/': (DatenschutzPage, "datenschutz")
}


def set_app_urls(app: Flask):
    for url, (view, view_name) in URLS.items():
        app.add_url_rule(url, view_func=view.as_view(view_name))

