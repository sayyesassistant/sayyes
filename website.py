
import logging
import urllib
import webapp2
import json
from app import AppHandler
from google.appengine.api import mail
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
        templateValues['user'] = User.get_by_id(self.auth['key'])

        self.render(Const.WEBSITE + 'profile.html', templateValues)

    def post(self):

        errors = {}

        try:
            self.logged()
            user = User.get_by_id(self.auth['key'])
            user.name = self.util.stripTags(self.request.get('name'))
            user.companyName = self.util.stripTags(self.request.get('companyName'))

            if self.request.get('pwd') is not None:
                user.pwd = user.hash(self.request.get('pwd'))

            user.website = self.request.get('website')

            # save and get the key
            newKey = user.put()

            if newKey is None:
                errors['user'] = "User could not be updated"
                raise Exception()

            ss = newKey.get()
            # update the browser session
            auth = {}
            auth['key'] = user.key.id()
            auth['name'] = user.name

            #logging.info(auth)
            self.session['auth'] = auth

            self.jsonSuccess("Profile updated")
        except Exception as e:
            logging.info(e.args)
            self.jsonError(None, 1, errors)

class SignUp(AppHandler):
    def get(self):
        # check the browser session
        self.logged()
        if self.auth is not None:
            self.redirect('/cp')

        self.render(Const.WEBSITE + 'signup.html', {})

    def post(self):

        errors = {}

        try:
            user = User()
            user.name = self.util.stripTags(self.request.get('name'))

            email = self.util.stripTags(self.request.get('email').strip())
            usrEmail = User.query(User.email == email).get()

            if usrEmail is not None:
                errors['email'] = "This e-mail has already been registered"
                raise Exception()

            user.email = self.request.get('email')
            user.companyName = self.util.stripTags(self.request.get('companyName'))
            user.pwd = user.hash(self.request.get('pwd'))
            user.website = self.request.get('website')
            user.accessKey = user.pwdGenerator(12) + strftime("%y%m%d%H%M%S", gmtime())
            # save and get the key
            newKey = user.put()

            if newKey is None:
                errors['user'] = "User could not be created"
                raise Exception()

            ss = newKey.get()
            # create a browser session
            auth = {}
            auth['key'] = user.key.id()
            auth['name'] = user.name
            auth['email'] = user.email
            auth['accessKey'] = user.accessKey

            #logging.info(auth)
            self.session['auth'] = auth

            self.jsonSuccess("Account created")
        except Exception as e:
            logging.info(e.args)
            self.jsonError(None, 1, errors)

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
            auth = {}
            auth['key'] = logged.key.id()
            auth['name'] = logged.name
            auth['email'] = logged.email
            auth['accessKey'] = logged.accessKey
            logging.info(auth)
            self.session['auth'] = auth
            self.jsonSuccess()


class LogOut(AppHandler):
    def get(self):
        del self.session['auth']
        self.redirect('/')

class ForgotPassword(AppHandler):
    def get(self):
        self.render(Const.WEBSITE + 'forgot_password.html', {})

    def post(self):
        email = self.request.get('email').strip()
        userEmail = User.query(User.email == email).get()
        #logging.info(userEmail.email)
        if userEmail is not None:
            # reset pwd
            newPwd = userEmail.pwdGenerator()
            userEmail.pwd = userEmail.hash(newPwd)
            key = userEmail.put()
            # test entity
            if key is None:
                self.jsonError()
            # send email
            subject = "New password request"

            html = "<p><b>*** " + subject + " ***</b></p>"
            html = html + "<p>Hi " + userEmail.name + "!</p>"
            html = html + "<p>Here it goes you new password: <b>" + newPwd + "</b></p>"
            html = html + "<p>If you did not request a new password please contact our support team by replying to this e-mail.</p>"
            html = html + "<p>Best regards from <b>" + Const.APP_SENDER_NAME + "</b>.</p>"

            plainText = "*** " + subject + " ***\n"
            plainText = plainText + "Hi " + userEmail.name + "!\n"
            plainText = plainText + "Here it goes you new password: " + newPwd + "\n"
            plainText = plainText + "If you did not request a new password please contact our support team by replying to this e-mail.\n"
            plainText = plainText + "Best regards from " + Const.APP_SENDER_NAME + " .\n"

            sender = Const.APP_SENDER_NAME + " <" + Const.APP_SENDER_EMAIL + ">"
            message = mail.EmailMessage(sender=sender, subject=subject + " - Say Yes! Assistant")
            message.to = userEmail.name + " <" + userEmail.email + ">"
            message.body = plainText
            message.html = html
            message.send()
        # returns success anyway as you cannot tell if email was found
        self.jsonSuccess()

class CP(AppHandler):
    def get(self):

        # check the browser session
        self.logged()
        if self.auth is None:
            self.redirect('/login')

        templateValues = {}
        templateValues['auth'] = self.auth

        key = ndb.Key(User, self.auth['key'])

        query = Session.queryUser(key)
        templateValues['sessions'] = query.fetch(10)

        query2 = Template.queryUser(key)
        templateValues['templates'] = query2.fetch(10)
        #logging.info(templateValues['templates'])

        # um exemplo do json p/ testes
        j = {
            "start_with":"a",
            "id":"ABC123",
            "attendant":{
                "id":"foo",
                "name":"Attendant Name",
                "email":"foo@sayyes.com",
                "phone":None
            },
            "client":None,
            "views": [{
                "name":"a",
                "template_name":"mock_template",
                "data":{
                "title":"Mock View example",
                "description":"Some description goes here",
                "nav":[{
                    "label":"no forms please!",
                    "view":"b"
                }],
                "form": {
                    "action": "/mock-service/login.json",
                    "method": "GET",
                    "id": "sayyes",
                    "on_success": "nav=b",
                    "on_error": "alert",
                    "hiddens": [{
                        "name":"expect",
                        "value":"false"
                    }],
                    "buttons": [{
                        "label":"check...",
                        "value":"foo"
                    }],
                    "inputs": [{
                        "name":"name",
                        "type":"text",
                        "placeholder":"your name",
                        "required": "required"
                    }, {
                        "name":"email",
                        "type":"email",
                        "placeholder":"Type your email",
                        "required":"required"
                    }]
                }
            }
                }, {

                "name":"b",
                "template_name":"mock_template",
                "data":{
                    "title":"I can't see your info!",
                    "description":"Seems that you don't like forms!",
                    "nav":[{
                        "label":"try again",
                        "view":"a"
                    }]
                }
            }]
        }

        templateValues['json'] = json.dumps(j)
        templateValues['html'] = """
<div class="view">
	<div class="alert"></div>
	{{#title}}
		<h1>{{{title}}}</h1>
	{{/title}}
	{{#description}}
		<h2>{{{description}}}</h2>
	{{/description}}
	{{#has_nav}}
		<nav>
			<ul>
			{{#nav}}
				<a href="#{{{view}}}" data-role="nav">{{{label}}}</a>
			{{/nav}}
			</ul>
		</nav>
	{{/has_nav}}
	{{#form}}
		<form id="{{{form.id}}}" action="{{{form.action}}}" method="{{{form.method}}}" data-on-success="{{{form.on_success}}}" data-on-error="{{{form.on_error}}}">
			{{#form.hiddens}}
				<input type="hidden" name="{{{name}}}" value="{{{value}}}" />
			{{/form.hiddens}}
			{{#form.inputs}}
				<input type="{{{type}}}" name="{{{name}}}" placeholder="{{{placeholder}}}" {{{required}}} />
			{{/form.inputs}}
			<nav>
			{{#form.buttons}}
				<button value="{{{value}}}">{{{label}}}</button>
			{{/form.buttons}}
			</nav>
		</form>
	{{/form}}
</div>
"""

        self.render(Const.WEBSITE + 'cp.html', templateValues)

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
    ('/profile', Profile)
], debug=True, config=config)
