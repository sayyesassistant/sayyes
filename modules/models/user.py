import logging
from google.appengine.ext import ndb
from modules.toolbox.util import *

class User(ndb.Model):
    
    name = ndb.StringProperty(required=True)
    pwd = ndb.StringProperty(required=True)
    email = ndb.StringProperty()
    companyName = ndb.StringProperty(indexed=False)
    website = ndb.StringProperty()
    accessKey = ndb.StringProperty()
    created = ndb.DateTimeProperty(auto_now_add=True)
    modified = ndb.DateTimeProperty(auto_now_add=True)
    
class UserLogger(object):
    
    util = None
    user = None
    
    def __init__(self):
        
        self.util = Util()
        self.user = User()
    
    def login(self, email, pwd):
        
        pwd = self.util.hash(pwd.strip())
        return self.user.query(User.email == email.strip(), User.pwd == pwd).get()