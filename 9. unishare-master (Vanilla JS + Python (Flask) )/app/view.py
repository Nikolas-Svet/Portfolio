from flask.views import MethodView
from flask import render_template, url_for, request, redirect, jsonify


class IndexPage(MethodView):
    def get(self):
        return render_template('pages/index.html')

class InfoPage(MethodView):
    def get(self):
        return render_template('pages/imprint.html')
class DatenschutzPage(MethodView):
    def get(self):
        return render_template('pages/datenschutz.html')