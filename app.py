import json

import jinja2
import logging
import os
import webapp2
from util import Util
from webapp2_extras import sessions

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'])
 
class AppHandler(webapp2.RequestHandler):
    
    templateValues = {}
    auth = None
    util = None
    
    def __init__(self, request, response):
        # inicia webapp2
        self.initialize(request, response)
        self.util = Util()
        #logging.info(self.logged()) sempre retorna False no contrutor :/
                
    def logged(self):
        try:
            self.auth = self.session.get('auth')
            return True
        except:
            self.auth = None
            return False
        
    # workaround p/ trabalhar com sessoes
    # http://webapp-improved.appspot.com/api/webapp2_extras/sessions.html
    def dispatch(self):
        # Get a session store for this request.
        self.session_store = sessions.get_store(request=self.request)
        try:
            # Dispatch the request.
            webapp2.RequestHandler.dispatch(self)
        finally:
            # Save all sessions.
            self.session_store.save_sessions(self.response)
        
    @webapp2.cached_property
    def session(self):
        # Returns a session using the default cookie key.
        return self.session_store.get_session()
        
    def render(self, path, templateValues, retrn=False):
        # merge values
        self.templateValues = dict(self.templateValues.items() + templateValues.items())
        #logging.info(self.templateValues)
        # renderiza os tamplateValues
        template = JINJA_ENVIRONMENT.get_template(path)
        if retrn == False:
            self.response.write(template.render(self.templateValues))
        else:
            return template.render(self.templateValues)
        
    def json(self, dictionary):
        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps(dictionary))
        return True
        
    def jsonSuccess(self, msg=None, value=None):
        r = {}
        r['status'] = "success"
        r['message'] = msg
        r['exception'] = None
        r['value'] = value
        self.json(r)
    
    def jsonError(self, msg=None, exception=None, value=None):
        r = {}
        r['status'] = "error"
        r['message'] = msg
        r['exception'] = exception
        r['value'] = value
        self.json(r)
        
    def jsonOutput(self, output):
        r = {}
        r['status'] = "output"
        r['message'] = None
        r['exception'] = None
        r['value'] = {"output": output}
        self.json(r)

    def isAjax(self):
        if 'X-Requested-With' in self.request.headers.keys():
            return True
        else:
            return False
        
        
        
        
        
        