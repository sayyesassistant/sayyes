
import logging
import urllib
import webapp2
from app import AppHandler
from google.appengine.api import mail
from models import User
from util import Const

class HomePage(AppHandler):
    def get(self):
        
        templateValues = {'teste':'xxx'}
        self.render(Const.WEBSITE + 'index.html', templateValues)
        
class SignUp(AppHandler):
    def get(self):
        # verifica a sessao
        self.logged()
        if self.auth is not None:
            self.redirect('/cp')
            
        self.render(Const.WEBSITE + 'signup.html', {})
        
    def post(self):
        
        errors = {}
        
        try:
            user = User()
            user.name = self.request.get('name')
            
            email = self.request.get('email').strip()
        
            usrEmail = User.query(User.email == email).get()
            
            if usrEmail is not None:
                errors['email'] = "This e-mail has already been registered"
                raise Exception()
            
            user.email = self.request.get('email')
            user.companyName = self.request.get('companyName')
            user.pwd = user.hash(self.request.get('pwd'))
            user.website = self.request.get('website')
            # salva e pega a key
            newKey = user.put()
            
            if newKey is None:
                errors['entity'] = "Entity not saved"
                raise Exception()
        
            user = newKey.get()
            # cria a sessao
            auth = {}
            auth['key'] = user.key.id()
            auth['name'] = user.name
            auth['email'] = user.email
    
            #logging.info(auth)
            self.session['auth'] = auth
            
            self.jsonSuccess("Account created")
        except:
            #logging.info(errors)
            self.jsonError({'errors': errors})

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
            self.jsonError()
        else:
            # cria a sessao
            auth = {}
            auth['key'] = logged.key.id()
            auth['name'] = logged.name
            auth['email'] = logged.email
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
        # verifica a sessao
        self.logged()
        if self.auth is None:
            self.redirect('/login')
        
        self.render(Const.WEBSITE + 'cp.html', {'auth':self.auth})

config = {}
config['webapp2_extras.sessions'] = {
    'secret_key': '76859309657453542496749683645DCMS4',
}

application = webapp2.WSGIApplication([
    ('/', HomePage),
    ('/logout', LogOut),
    ('/login', LogIn),
    ('/signup', SignUp),
    ('/forgot_password', ForgotPassword),
    ('/cp', CP)
], debug=True, config=config)
