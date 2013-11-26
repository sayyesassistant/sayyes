
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

        errors = {}

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

            if userKey is None:
                errors['user'] = "User could not be updated"
                raise Exception()

            # update the browser session
            auth = self.session['auth']
            auth['keyId'] = user.key.id()
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
            userKey = user.put()

            if userKey is None:
                errors['user'] = "User could not be created"
                raise Exception()

            # create a browser session
            self.createBrowserSession(user.key.id(), user.name, user.email, user.accessKey)

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
        
        email = self.request.get('email').strip()
        userEmail = User.query(User.email == email).get()
        #logging.info(userEmail.email)
        if userEmail is not None:
            # reset pwd
            newPwd = userEmail.pwdGenerator()
            userEmail.pwd = userEmail.hash(newPwd)
            userKey = userEmail.put()
            # test entity
            if userKey is None:
                self.jsonError()
            
        mailSender = MailSender()
        mailSender.forgotPwd(userEmail.name, userEmail.email, newPwd)
        
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

        userKey = ndb.Key(User, self.auth['keyId'])

        query = Session.queryUser(userKey)
        templateValues['sessions'] = query.fetch(10)

        templateValues['templates'] = Template.orderByTitle()

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
