
import logging
import urllib
import webapp2
import json
from app import AppHandler
from models import *
from util import *
from time import gmtime, strftime
from google.appengine.ext import ndb

class HomePage(AppHandler):

    def get(self):
        templateValues = {'teste':'teste'}
        self.render(Const.WEBSITE + 'index.html', templateValues)

class Profile(AppHandler):

    def get(self):
        # check the browser session
        self.logged()
        if self.auth is None:
            self.redirect('/login')
        templateValues = {}
        templateValues['auth'] = self.auth
        templateValues['user'] = User.get_by_id(self.auth['keyId'])

        self.render(Const.WEBSITE + 'profile.html', templateValues)

    def post(self):
        try:
            self.logged()
            user = User.get_by_id(self.auth['keyId'])
            user.name = self.util.stripTags(self.request.get('name'))
            user.companyName = self.util.stripTags(self.request.get('companyName'))
            if self.request.get('pwd') is not None:
                user.pwd = user.hash(self.request.get('pwd'))
            user.website = self.request.get('website')
            # save and get the key
            userKey = user.put()
            # update the browser session
            auth = self.session['auth']
            auth['keyId'] = user.key.id()
            auth['name'] = user.name
            self.session['auth'] = auth
            self.jsonSuccess("Profile updated")
        except Exception as e:
            logging.info()
            self.jsonError("User could not be updated", 1, e.args)

class SignUp(AppHandler):

    def get(self):
        # check the browser session
        self.logged()
        if self.auth is not None:
            self.redirect('/cp')
        self.render(Const.WEBSITE + 'signup.html', {})

    def post(self):
        try:
            user = User()
            user.name = self.util.stripTags(self.request.get('name'))
            email = self.util.stripTags(self.request.get('email').strip())
            usrEmail = User.query(User.email == email).get()
            if usrEmail is not None:
                raise UserWarning("This e-mail has already been registered")
            user.email = self.request.get('email')
            user.companyName = self.util.stripTags(self.request.get('companyName'))
            user.pwd = user.hash(self.request.get('pwd'))
            user.website = self.request.get('website')
            user.accessKey = user.pwdGenerator(12) + strftime("%y%m%d%H%M%S", gmtime())
            # save and get the key
            userKey = user.put()
            self.createBrowserSession(user.key.id(), user.name, user.email, user.accessKey)
            self.jsonSuccess("Account created")
        except Exception as e:
            self.jsonError("User could not be created", 1, e.args)

class LogIn(AppHandler):

    def get(self):
        # verifica a sessao
        self.logged()
        if self.auth is not None:
            self.redirect('/cp')
        self.render(Const.WEBSITE + 'login.html', {})

    def post(self):
        user = User()
        logged = user.login(self.request.get('email'), self.request.get('pwd'))
        if logged is None:
            self.jsonError("Wrong username or password")
        else:
            # cria a sessao
            self.createBrowserSession(logged.key.id(), logged.name, logged.email, logged.accessKey)
            self.jsonSuccess()


class LogOut(AppHandler):

    def get(self):
        del self.session['auth']
        self.redirect('/')

class ForgotPassword(AppHandler):

    def get(self):
        self.render(Const.WEBSITE + 'forgot_password.html', {})

    def post(self):
        try:
            email = self.request.get('email').strip()
            user = User.query(User.email == email).get()
            #logging.info(user.email)
            if user is not None:
                # reset pwd
                newPwd = user.pwdGenerator()
                user.pwd = user.hash(newPwd)
                userKey = user.put()
                # test entity
                if userKey is None:
                    raise ValueError("e-mail not registered")
                #send new pwd
                nps = NewPasswordSender(newPwd)
                nps.toName = user.name
                nps.toEmail = user.email
                nps.sendNewPassword()
                self.jsonSuccess()
        except Exception as e:
            self.jsonError("User not found", 2, e.args)

class CP(AppHandler):

    def get(self):

        # check the browser session
        self.logged()
        if self.auth is None:
            self.redirect('/login')

        templateValues = {}
        templateValues['auth'] = self.auth

        userKey = ndb.Key(User, self.auth['keyId'])

        query = Session.queryUser(userKey)
        templateValues['sessions'] = query.fetch(10)

            # um exemplo do json p/ testes
        j = {
                "start_with":"beginning",
                "id":"ABC123",
                "attendant":{
                        "id":"foo",
                        "name":"Attendant Name",
                        "email":"sac@sayyes.cc",
                        "phone":"+55 11 98765 4321"
                },
                "client":None,
                "views" : [{
                        "name":"beginning",
                        "template_name":"mock_template",
                        "eol" : False,
                        "data":{
                                "title":"O que voce gostaria de fazer?",
                                "nav":[{
                                        "label":"Quero comprar pacotes de viagem",
                                        "view":"travell"
                                },{
                                        "label":"Trabalhe com a gente",
                                        "view":"career"
                                }]
                        }
                } ,{
                        "name":"career",
                        "template_name":"mock_template",
                        "eol" : False,
                        "data":{
                                "title":"Trabalhe com a gente",
                                "description":"Receba oportunidades de vagas",
                                "nav":[{
                                        "label":"voltar",
                                        "view":"beginning"
                                }],
                                "form" : {
                                        "action" : None,
                                        "method" : None,
                                        "id" : "get-cv",
                                        "on_success" : "career-feedback",
                                        "on_error" : "error",
                                        "inputs" : [{
                                                        "required":"true",
                                                        "placeholder":"your email address",
                                                        "type":"email",
                                                        "name":"applicant"
                                                }],
                                        "buttons":[{
                                                "name":"submit",
                                                "label":"Enviar"
                                        }]
                                }
                        }
                } ,{
                        "name":"career-feedback",
                        "template_name":"mock_template",
                        "eol" : True,
                        "data":{
                                "title":"Obrigado!",
                                "description":"Assim que alguma vaga aparecer vc sera avisado.",
                                "nav":[{
                                        "label":"voltar",
                                        "view":"beginning"
                                }]
                        }
                } , {
                        "name":"travell",
                        "template_name":"mock_template",
                        "eol" : False,
                        "data":{
                                "title":"Para qual destino?",
                                "form" : {
                                        "action" : "/mock-service/destination.json",
                                        "method" : "POST",
                                        "id" : "get-destination",
                                        "on_success" : "destination",
                                        "on_error" : "error",
                                        "radios" : [{
                                                        "required":"true",
                                                        "label":"africa",
                                                        "value":"africa",
                                                        "name":"destination"
                                                } , {
                                                        "required":"true",
                                                        "label":"patagonia",
                                                        "value":"patagonia",
                                                        "name":"destination"
                                        }],
                                        "buttons":[{
                                                "name":"submit",
                                                "label":"fazer solicitacao"
                                        }]
                                }, "nav" : [{
                                        "label":"voltar",
                                        "view":"beginning"
                                }]
                        }
                } , {
                        "name":"error",
                        "template_name":"mock_template",
                        "eol" : False,
                        "data":{
                                "title":"Ops!",
                                "description":"Ocorreu um erro durante sua navegacao.",
                                "nav" : [{
                                        "label":"tente novamente",
                                        "view":"travell"
                                }]
                        }
                } , {
                        "name" : "destination",
                        "template_name":"mock_template",
                        "eol" : False,
                        "data":{
                                "description" : "Seems that you didn't used the service. this is a static content.",
                                "nav" : [{
                                        "label":"ver mais destinos",
                                        "view":"travell"
                                },{
                                        "label":"voltar para o inicio",
                                        "view":"beginning"
                                }]
                        }
                } ,  {
                        "name" : "result",
                        "template_name":"mock_template",
                        "eol" : True,
                        "data":{
                                "title" : "Obrigado!",
                                "nav" : [{
                                        "label":"ver mais destinos",
                                        "view":"travell"
                                },{
                                        "label":"voltar para o inicio",
                                        "view":"beginning"
                                }]
                        }
                }]
        }

        templateValues['json'] = json.dumps(j)


        self.render(Const.WEBSITE + 'cp.html', templateValues)

class TplPut(AppHandler):

    def get(self):
        tpl = Template()
        tpl.id = 'mock_template'
        tpl.title = 'Mock Template'
        tpl.html = """
        <div class="view">
                {{#title}}
                        <h1>{{title}}</h1>
                {{/title}}
                {{#description}}
                        <h2>{{description}}</h2>
                {{/description}}
                {{#nav.length}}
                        <nav>
                                <ul>
                                {{#nav}}
                                        <a href="#{{view}}" data-role="nav">{{label}}</a>
                                {{/nav}}
                                </ul>
                        </nav>
                {{/nav.length}}
                {{#form}}
                        <form id="{{form.id}}" {{#form.action}}action="{{form.action}}"{{/form.action}}{{^form.action}}action="#"{{/form.action}} method="{{form.method}}" data-on-success="{{form.on_success}}" data-on-error="{{form.on_error}}">
                                {{#form.hiddens}}
                                        <input type="hidden" name="{{name}}" value="{{value}}" />
                                {{/form.hiddens}}
                                {{#form.inputs}}
                                        <input type="{{type}}" name="{{name}}" placeholder="{{placeholder}}" {{required}} />
                                {{/form.inputs}}
                                {{#form.radios}}
                                        <input type="radio" name="{{name}}" value="{{value}}" {{required}}>{{label}}</input>
                                {{/form.radios}}
                                {{#form.checkboxes}}
                                        <input type="checkbox" name="{{name}}" value="{{value}}" {{required}}>{{label}}</input>
                                {{/form.checkboxes}}
                                <nav>
                                {{#form.buttons}}
                                        <button name="{{name}}" value="{{value}}">{{label}}</input>
                                {{/form.buttons}}
                                </nav>
                        </form>
                {{/form}}
        </div>
        """
        tpl.put()

config = {}
config['webapp2_extras.sessions'] = {
    'secret_key': Const.SESSION_SECRET_KEY,
}

application = webapp2.WSGIApplication([
    ('/', HomePage),
    ('/logout', LogOut),
    ('/login', LogIn),
    ('/signup', SignUp),
    ('/forgot_password', ForgotPassword),
    ('/cp', CP),
    ('/profile', Profile),
    ('/template_put', TplPut)
], debug=True, config=config)
