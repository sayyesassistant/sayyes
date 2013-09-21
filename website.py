
import logging
import urllib
import webapp2
from app import AppHandler
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
            user.website1 = self.request.get('website1')
            user.website2 = self.request.get('website2')
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
    ('/cp', CP)
], debug=True, config=config)
