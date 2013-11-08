
import json

import logging
import urllib
import webapp2
from app import AppHandler
from google.appengine.api import mail
from google.appengine.ext import ndb
from models import *
from util import *

class Image(webapp2.RequestHandler):
    def get(self):
        key = ndb.Key(urlsafe=self.request.get('key'))
        template = key.get()
        if template.bg:
            self.response.headers['Content-Type'] = 'image/png'
            self.response.out.write(template.bg)
        else:
            self.response.out.write('No image')

class Start(AppHandler):
    def get(self):
        
        key = ndb.Key(urlsafe=self.request.get('key'))
        session = key.get()
        logging.info(session)

        # faz escape por double quote apenas, pois eh o unico permitido oficialmente pelo json
        instruction = session.instruction.replace('"', '\\"')
        
        template = None
        if session.template:
            template = session.template.get()

        templateValues = {'session': session, 'instruction': instruction, 'template': template}

        self.render(Const.SESSION + 'start.html', templateValues)

class Create(AppHandler):

    def post(self):
        #logging.info(self.isAjax())
        
        errors = {}

        try:
            user = User()
            accessKey = self.request.get('accessKey')
            email = self.request.get('email')

            user = self.authKey(accessKey, email);

            if user is None:
                errors['authenticationFailed'] = "Invalid e-mail or access key"
                errors['accessKeySent'] = accessKey
                errors['emailSent'] = email
                raise Exception()

            session = Session()
            session.title = self.util.stripTags(self.request.get('title'))
            session.instruction = self.request.get('instruction')
            session.user = user.key

            if self.request.get('template'):
                key = ndb.Key(urlsafe=self.request.get('template'))
                template = key.get()
                # testa de novo p/ ver se achou a entidade
                if template is not None:
                    session.template = template.key
            
            # salva e pega a key
            newKey = session.put()

            if newKey is None:
                raise Exception()

            ss = newKey.get()
            # cria a sessao
            cs = {}
            cs['url'] = Const.APP_URL + 'session/start/?key=' + str(ss.key.id())

            self.jsonSuccess("Session created", cs)

        except Exception as e:
            
            logging.info(e.args)
            self.jsonError("Session could not be created", 1, errors)

class TemplateCreate(AppHandler):

    def post(self):

        errors = {}

        try:
            user = User()
            accessKey = self.request.get('accessKey')
            email = self.request.get('email')

            user = self.authKey(accessKey, email);

            if user is None:
                errors['authenticationFailed'] = "Invalid e-mail or access key"
                errors['accessKeySent'] = accessKey
                errors['emailSent'] = email
                raise Exception()

            template = Template()
            template.title = self.util.stripTags(self.request.get('title'))
            template.html = self.request.get('html')
            template.user = user.key

            template.put()

            self.jsonSuccess()
            
        except Exception as e:

            logging.info(e.args)
            self.jsonError("Template could not be created", 2, errors)


config = {}
config['webapp2_extras.sessions'] = {
    'secret_key': Const.SESSION_SECRET_KEY,
}

application = webapp2.WSGIApplication([
    ('/session/img.py', Image),
    ('/session/create.py', Create),
    ('/session/start.py', Start),
    ('/session/template.py', TemplateCreate),
], debug=True, config=config)
