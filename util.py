import re

class Const(object):
    WEBSITE = "views/website/"
    SESSION = "views/session/"
    INC = "views/includes/"
    APP_SENDER_NAME = "Say Yes! Assistant Support Team"
    APP_SENDER_EMAIL = "support@sayyes.cc"
    APP_URL = "http://www.sayyes.cc/"
    SESSION_SECRET_KEY = "76859309657453542496749683645DCMS4"

class Util(object):
    def stripTags(self, str):
        p = re.compile(r'<.*?>')
        return p.sub('', str)