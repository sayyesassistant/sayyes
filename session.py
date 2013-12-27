
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

        urlSafeSessionKey = self.request.get('key')
        sessionKey = ndb.Key(urlsafe=urlSafeSessionKey)
        session = sessionKey.get()
        #logging.info(session)

        # faz escape por double quote apenas, pois eh o unico permitido oficialmente pelo json
        instruction = session.instruction.replace('"', '\\"')

        templates = Template.getSessionTemplates(session.instruction)

        templateValues = {
            'session': session,
            'instruction': instruction,
            'tpls': templates,
            'sessionKey': urlSafeSessionKey,
        }

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
            
            # salva e pega a key
            newKey = session.put()

            if newKey is None:
                raise Exception()

            sessionKey = newKey.get()
            # cria a sessao
            returnObj = {}
            returnObj['url'] = Const.APP_URL + 'session/start/?key=' + str(sessionKey.key.id())

            self.jsonSuccess("Session created", returnObj)

        except Exception as e:
            
            if len(e.args) > 0:
                errors['appException'] = e.args
                
            self.jsonError("Session could not be created", 1, errors)

class RegisterResponse(AppHandler):
    
    def post(self):

        errors = {}

        try:

            if not self.isAjax():
                errors['invalidRequest'] = "only ajax requests are allowed"
                raise Exception()

            sessionKey = ndb.Key(urlsafe=self.request.get('sessionKey'))

            if sessionKey is None:
                errors['sessionKey'] = "session not found"
                raise Exception()
            
            # check if response has already been created
            if self.request.get('responseKey'):
                urlSafeResponseKey = self.request.get('responseKey')
                responseKey = ndb.Key(urlsafe=urlSafeResponseKey)
                sr = responseKey.get()
                sr.breadcrumb += ',"' + self.request.get('viewName') + '"'
                logging.info("response exists")
            else:
                sr = SessionResponse()
                sr.breadcrumb = '"' + self.request.get('viewName') + '"'
                
            sr.session = sessionKey

            responseKey = sr.put()

            responseObj = {
                "hiddens" : [{"responseKey":responseKey.urlsafe()}],
                "view_data" : {"title" : "View's title set by mock-service.py"} # TESTE APENAS
            }

            self.jsonSuccess('Response registered', responseObj)

        except Exception as e:

            if len(e.args) > 0:
                errors['appException'] = e.args

            self.jsonError("Response could not be registered", 2, errors)


config = {}
config['webapp2_extras.sessions'] = {
    'secret_key': Const.SESSION_SECRET_KEY,
}

application = webapp2.WSGIApplication([
    ('/session/img.py', Image),
    ('/session/create.py', Create),
    ('/session/start.py', Start),
    ('/session/response.py', RegisterResponse),
], debug=True, config=config)
