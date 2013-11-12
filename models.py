import hashlib
import random
import string
from google.appengine.ext import ndb

#https://developers.google.com/appengine/docs/python/ndb/properties

class User(ndb.Model):
    
    name = ndb.StringProperty(required=True)
    pwd = ndb.StringProperty(required=True)
    email = ndb.StringProperty()
    companyName = ndb.StringProperty(required=True)
    website = ndb.StringProperty(required=True)
    accessKey = ndb.StringProperty()
    created = ndb.DateTimeProperty(auto_now_add=True)
    modified = ndb.DateTimeProperty(auto_now_add=True)

    def hash(self, str):
        return hashlib.sha224(str.strip()).hexdigest()

    def pwdGenerator(self, num=6):
        return ''.join(random.choice(string.ascii_lowercase + string.ascii_uppercase + string.digits) for x in range(num))
    
    def login(self, email, pwd):
        pwd = self.hash(pwd)
        return self.query(User.email == email.strip(), User.pwd == pwd).get()

class Template(ndb.Model):

    title = ndb.StringProperty(required=True)
    user = ndb.KeyProperty(kind=User)
    html = ndb.StringProperty(indexed=False, required=True)
    created = ndb.DateTimeProperty(auto_now_add=True)
    modified = ndb.DateTimeProperty(auto_now_add=True)

    @classmethod
    def queryUser(cls, ancestorKey):
        return cls.query(cls.user == ancestorKey).order(-cls.created)
    
class Session(ndb.Model):
    
    title = ndb.StringProperty(indexed=False, required=True)
    instruction = ndb.JsonProperty(required=True, compressed=True)
    userData = ndb.JsonProperty(compressed=True)
    user = ndb.KeyProperty(kind=User)
    template = ndb.KeyProperty(kind=Template)
    created = ndb.DateTimeProperty(auto_now_add=True)
    modified = ndb.DateTimeProperty(auto_now_add=True)

    @classmethod
    def queryUser(cls, ancestorKey):
        return cls.query(cls.user == ancestorKey).order(-cls.created)

    