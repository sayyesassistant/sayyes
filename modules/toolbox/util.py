import logging
import re
import random
import string
import hashlib
from time import gmtime, strftime

class Const(object):
    WEBSITE_PATH = "views/website/"
    SESSION_PATH = "views/session/"
    #INC_PATH = "views/includes/"
    APP_SENDER_NAME = "Say Yes! Assistant Support Team"
    APP_SENDER_EMAIL = "support@sayyes.cc"
    APP_URL = "http://www.sayyes.cc/"
    SESSION_SECRET_KEY = "76859309657453542496749683645DCMS4"

class Util(object):
    
    def stripTags(self, str):
        p = re.compile(r'<.*?>')
        return p.sub('', str)
    
    def hash(self, str):
        return hashlib.sha224(str.strip()).hexdigest()

    def generatePwd(self, size=6):
        strRange = string.ascii_lowercase + string.ascii_uppercase + string.digits + strftime("%y%m%d%H%M%S", gmtime())
        return ''.join(random.choice(strRange) for x in range(size))