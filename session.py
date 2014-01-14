
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
        
        # mustache message, nao ta rolando de colocar direto na view por causa do '#'
        mm = '{{#message}}<h2>{{message}}</h2>{{/message}}{{^message}}<h2>Please, try again later.</h2>{{/message}}'

        templateValues = {
            'session': session,
            'instruction': instruction,
            'tpls': templates,
            'sessionKey': urlSafeSessionKey,
            'mustache_message': mm
        }

        self.render(Const.SESSION + 'start.html', templateValues)

class Create(AppHandler):

    def post(self):
        #logging.info(self.isAjax())
        try:
            user = User()
            accessKey = self.request.get('accessKey')
            email = self.request.get('email')
            user = self.authKey(accessKey, email);
            if user is None:
                raise UserWarning("User not found: invalid e-mail or access key")
            session = Session()
            session.title = self.util.stripTags(self.request.get('title'))
            session.instruction = self.request.get('instruction')
            session.user = user.key
            # salva e pega a key
            newKey = session.put()
            sessionKey = newKey.get()
            # cria a sessao
            returnObj = {}
            returnObj['url'] = Const.APP_URL + 'session/start/?key=' + str(sessionKey.key.id())
            self.jsonSuccess("Session created", returnObj)
        except Exception as e:
            self.jsonError("Session could not be created", 1, e.args)

class RegisterResponse(AppHandler):
    
    def createResponse(self):
        try:
            sessionKey = ndb.Key(urlsafe=self.request.get('sessionKey'))
            if sessionKey is None:
                raise ValueError("Invalid sessionKey")
            sr = SessionResponse()
            sr.session = sessionKey
            sr.breadcrumb = '"' + self.request.get('viewName') + '"'
            responseKey = sr.put()
            responseObj = {
                "hiddens" : [{"responseKey":responseKey.urlsafe()}],
                #"view_data" : {"title" : "View's title set by mock-service.py"} # TESTE APENAS
            }
            self.jsonSuccess('Response created', responseObj)
        except Exception as e:
            self.jsonError("Response could not be registered", 2, e.args)
            
    def updateResponse(self):
        try:
            responseKey = ndb.Key(urlsafe=self.request.get('responseKey'))
            sr = responseKey.get()
            if sr is None:
                raise ValueError("Invalid responseKey")
            sr.breadcrumb += ',"' + self.request.get('viewName') + '"'
            responseKey = sr.put()
            responseObj = {
                "hiddens" : [{"responseKey":responseKey.urlsafe()}],
                #"view_data" : {"title" : "View's title set by mock-service.py"} # TESTE APENAS
            }
            self.jsonSuccess('Response created', responseObj)
        except Exception as e:
            self.jsonError("Response could not be registered", 2, e.args)
    
    def post(self):
        try:
            if not self.isAjax():
                raise UserWarning("Only ajax requests are allowed")
            if self.request.get('sessionKey'):
                self.createResponse()
            elif self.request.get('responseKey'):
                self.updateResponse()
            else:
                raise ValueError('Please inform either a sessionKey or responseKey')
        except Exception as e:
            self.jsonError("Response could not be registered", 2, e.args)


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
