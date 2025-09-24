from app.view import IndexPage, ServicesPage, CarsPage, ChildrenPage, ContactFormSendInTgBot, AboutUsPage
from flask import Flask

URLS = {
    '/': (IndexPage, 'index'),
    '/services/': (ServicesPage, 'services'),
    '/cars/': (CarsPage, 'cars'),
    '/children/': (ChildrenPage, "children"),
    '/about-us/': (AboutUsPage, "about-us"),

#     API
    '/api/tg_bot/': (ContactFormSendInTgBot, 'tg_bot')
}


def set_app_urls(app: Flask):
    for url, (view, view_name) in URLS.items():
        app.add_url_rule(url, view_func=view.as_view(view_name))
