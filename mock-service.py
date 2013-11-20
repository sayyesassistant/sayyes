 # -*- coding: utf-8 -*-
import webapp2
import json

class LoginForm(webapp2.RequestHandler):
    def validate(self, *args):
        self.response.headers['Content-Type'] = 'application/json;charset=utf-8'
        self.response.headers['Access-Control-Allow-Methods'] = 'POST, GET'
        user = self.request.get('name')
        email = self.request.get('email')
        obj = {
            "status": "error",
            "exception": -100,
            "message" : "expecting user and email",
            "value" : None
        }
        if user != None and user != "" and email != None and email != "" :
            obj = {
                "status" : "success",
                "exception" : None,
                "message" : None,
                "value" : {
                    "title":"Hy "+user,
                    "description":"Don't worries we won't send any email to: " + email
                }
            }
        self.response.out.write(json.dumps(obj))

    def get(self):
        self.validate(self)

    def post(self):
        self.validate(self)

class DestiniationForm(webapp2.RequestHandler):
    def validate(self, *args):
        self.response.headers['Content-Type'] = 'application/json'
        self.response.headers['Access-Control-Allow-Methods'] = 'POST, GET'
        destination = self.request.get('destination')
        obj = {
            "status": "error",
            "exception": -100,
            "message" : "unexpected destination value",
            "value" : None
        }
        if destination != None and destination != "":
            obj = {
                "status" : "success",
                "exception" : None,
                "message" : None,
                "value" : {
                    "title":"Destino "+destination,
                    "description":"Obrigado por seu interesse.",
                    "text":"Em breve um de nossos atendentes entrará em contato com você."
                }
            }
        self.response.out.write(json.dumps(obj))

    def get(self):
        self.validate(self)

    def post(self):
        self.validate(self)

class Foo(webapp2.RequestHandler):

    def default_response(self, *args):
        self.response.headers['Content-Type'] = 'application/json'
        obj = {
            "status": "success",
            "exception": None,
            "message" : "well done!",
            "value" : None
        }
        self.response.out.write(json.dumps(obj))

    def get(self):
        self.default_response(self)

    def post(self):
        self.default_response(self)

application = webapp2.WSGIApplication([(r'/mock-service/login.json', LoginForm),(r'/mock-service/destination.json', DestiniationForm),
    (r'/mock-service/foo.json', Foo)],
    debug=True)