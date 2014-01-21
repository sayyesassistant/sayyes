import json

import hashlib
import logging
import random
import string
from modules.models.user import *
from google.appengine.ext import ndb

#https://developers.google.com/appengine/docs/python/ndb/properties

class Template(ndb.Model):

    title = ndb.StringProperty(required=True)
    id = ndb.StringProperty(required=True)
    html = ndb.StringProperty(indexed=False, required=True)
    created = ndb.DateTimeProperty(auto_now_add=True)
    modified = ndb.DateTimeProperty(auto_now_add=True)

    @classmethod
    def orderByTitle(self):
        q = self.query().order(self.title)
        return q.fetch()

    @classmethod
    def getSessionTemplates(self, instruction):
        j = json.loads(instruction)
        #logging.info(j)
        tpls = []
        for view in j['views']:
            tpls.append(view['template_name'])
        # turn it into a set
        tpls = list(set(tpls))
        #logging.info(tpls)
        q = self.query().order(self.title).filter(self.id.IN(tpls))
        return q.fetch()
    
class Session(ndb.Model):
    
    title = ndb.StringProperty(indexed=False, required=True)
    instruction = ndb.JsonProperty(required=True, compressed=True)
    user = ndb.KeyProperty(kind=User)
    created = ndb.DateTimeProperty(auto_now_add=True)
    modified = ndb.DateTimeProperty(auto_now_add=True)

    @classmethod
    def queryUser(cls, ancestorKey):
        return cls.query(cls.user == ancestorKey).order(-cls.created)

class SessionResponse(ndb.Model):

    userData = ndb.JsonProperty(compressed=True)
    breadcrumb = ndb.StringProperty(indexed=False)
    session = ndb.KeyProperty(kind=Session)
    created = ndb.DateTimeProperty(auto_now_add=True)
    modified = ndb.DateTimeProperty(auto_now_add=True)

    @classmethod
    def querySession(cls, ancestorKey):
        return cls.query(cls.session == ancestorKey).order(-cls.created)

    