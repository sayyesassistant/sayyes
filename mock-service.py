 # -*- coding: utf-8 -*-
import webapp2
import json
import random
import string

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
                    "title" : "Obrigado,",
                    "description" : "Quando você gostaria de ir para {}?".format(destination),
                    "text":"Em breve um de nossos atendentes entrará em contato com você.",
                    "form" : {
                        "action" : "/mock-service/destination-result.json",
                        "method" : "POST",
                        "id" : "get-application",
                        "on_success" : "result",
                        "on_error" : "error",
                        "hiddens" : [{
                          "value":destination,
                          "name":"destination"
                        }],
                        "inputs":[{
                            "name":"name",
                            "type":"text",
                            "placeholder":"Qual o seu nome?",
                            "required" : "required"
                        },{
                            "name":"email",
                            "type":"email",
                            "placeholder":"Qual o seu email?",
                            "required" : "required"
                        },{
                            "name":"date-start",
                            "type":"date",
                            "placeholder":"quando gostaria de ir?",
                            "required" : "required"
                        },{
                            "name":"date-end",
                            "type":"date",
                            "placeholder":"quantos gostadia de voltar?",
                            "required" : "required"
                        }],
                        "buttons" : [{
                            "label":"pedir orçamento de viagem",
                            "value":"receber"
                        }]
                    }
                }
            }
        self.response.out.write(json.dumps(obj))

    def get(self):
        self.validate(self)

    def post(self):
        self.validate(self)

class DestiniationResultForm(webapp2.RequestHandler):
    def validate(self, *args):
        self.response.headers['Content-Type'] = 'application/json'
        self.response.headers['Access-Control-Allow-Methods'] = 'POST, GET'
        c_name = self.request.get('name')
        c_dest = self.request.get('destination')
        char_set = string.ascii_uppercase + string.digits
        obj = {
            "status" : "success",
            "exception" : None,
            "message" : None,
            "value" : {
                "title" : "Obrigado {},".format(c_name),
                "description" : "O registro do seu atendimento para {}\né: {}".format(c_dest.upper(),''.join(random.sample(char_set*6,25)))
            }
        }
        self.response.out.write(json.dumps(obj))

    def get(self):
        self.validate(self)

    def post(self):
        self.validate(self)

class ViewAuthForm(webapp2.RequestHandler):
    def validate(self, *args):
        self.response.headers['Content-Type'] = 'application/json'
        self.response.headers['Access-Control-Allow-Methods'] = 'POST, GET'
        char_set = string.ascii_uppercase + string.digits
        obj = {
            "status" : "success",
            "exception" : None,
            "message" : None,
            "value" : {
                "hiddens" : [{"responseKey":''.join(random.sample(char_set*6,25))}]
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

application = webapp2.WSGIApplication([
    (r'/mock-service/login.json', LoginForm)
    ,(r'/mock-service/destination.json', DestiniationForm)
    ,(r'/mock-service/destination-result.json', DestiniationResultForm)
    ,(r'/mock-service/request-view.json', ViewAuthForm)
    , (r'/mock-service/foo.json', Foo)], debug=True)