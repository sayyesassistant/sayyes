
import logging
import urllib
import webapp2
from app import AppHandler
from google.appengine.api import mail
from models import *
from util import *
from google.appengine.ext import ndb

class Start(AppHandler):
    def get(self):
        
        key = ndb.Key(urlsafe=self.request.get('key'))
        s = key.get()
        templateValues = {'session': s}
        self.render(Const.SESSION + 'start.html', templateValues)

class Create(AppHandler):
    def post(self):
        logging.info(self.isAjax())
        
        errors = {}

        try:

            user = User()
            accessKey = self.request.get('accessKey')

            user = User.query(User.accessKey == accessKey).get()
            #logging.info(user)
            
            if user is None:
                errors['accessKey'] = "Invalid access key"
                errors['accessKeySent'] = accessKey
                raise Exception()

            session = Session()
            session.title = self.util.stripTags(self.request.get('title'))
            session.instruction = self.request.get('instruction')
            session.user = user.key
            
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
    ('/session/create.py', Create),
    ('/session/start.py', Start),
], debug=True, config=config)
