
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
        layout = key.get()
        if layout.bg:
            self.response.headers['Content-Type'] = 'image/png'
            self.response.out.write(layout.bg)
        else:
            self.response.out.write('No image')

class Start(AppHandler):
    def get(self):
        
        key = ndb.Key(urlsafe=self.request.get('key'))
        session = key.get()
        logging.info(session)

        # faz escape por double quote apenas, pois eh o unico permitido oficialmente pelo json
        instruction = session.instruction.replace('"', '\\"')
        
        layout = None
        if session.layout:
            layout = session.layout.get()

        templateValues = {'session': session, 'instruction': instruction, 'layout': layout}

        self.render(Const.SESSION + 'start.html', templateValues)

class Create(AppHandler):
    def post(self):
        logging.info(self.isAjax())
        
        errors = {}

        try:

            user = User()
            accessKey = self.request.get('accessKey')
            email = self.request.get('email')

            user = User.query(User.email == email).get()
            #logging.info(user)
            
            if user is None or user.accessKey != accessKey:
                errors['accessKey'] = "Invalid e-mail or access key"
                errors['accessKeySent'] = accessKey
                errors['emailSent'] = email
                raise Exception()

            session = Session()
            session.title = self.util.stripTags(self.request.get('title'))
            session.instruction = self.request.get('instruction')
            session.user = user.key

            if self.request.get('layout'):
                key = ndb.Key(urlsafe=self.request.get('layout'))
                layout = key.get()
                # testa de novo p/ ver se achou a entidade
                if layout is not None:
                    session.layout = layout.key
            
            # salva e pega a key
            newKey = session.put()

            if newKey is None:
                errors['entity'] = "Session could not be created"
                raise Exception()

            ss = newKey.get()
            # cria a sessao
            cs = {}
            cs['url'] = Const.APP_URL + 'session/start/?key=' + str(ss.key.id())
            cs['message'] = "Session created"

            self.jsonSuccess(cs)
        except Exception as e:
            logging.info(e.args)
            self.jsonError({'errors': errors})

config = {}
config['webapp2_extras.sessions'] = {
    'secret_key': Const.SESSION_SECRET_KEY,
}

application = webapp2.WSGIApplication([
    ('/session/img.py', Image),
    ('/session/create.py', Create),
    ('/session/start.py', Start),
], debug=True, config=config)
