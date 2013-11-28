import logging
import re
from google.appengine.api import mail

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

class MailSender(object):

    msgHTML = None
    msgTXT = None
    toName = None
    toEmail = None
    subject = None
    sender = Const.APP_SENDER_NAME + " <" + Const.APP_SENDER_EMAIL + ">"

    def send(self):

        message = mail.EmailMessage(sender=self.sender, subject=self.subject + " - Say Yes! Assistant")
        message.to = self.toName + " <" + self.email + ">"
        message.body = self.msgTXT
        message.html = self.msgHTML
        r = message.send()
        logging.info("New e-mail sent (" + self.subject + ") to " + message.to)
        return r

class NewPasswordSender(MailSender):

    newPwd = None

    def __init__(self, newPwd):
        self.newPwd = newPwd
        self.subject = "New password request"
        MailSender.__init__(self)

    def buildMsgHTML(self):

        self.msgHTML = "<p><b>*** " + self.subject + " ***</b></p>"
        self.msgHTML = self.msgHTML + "<p>Hi " + self.toName + "!</p>"
        self.msgHTML = self.msgHTML + "<p>Here it goes you new password: <b>" + self.newPwd + "</b></p>"
        self.msgHTML = self.msgHTML + "<p>If you did not request a new password please contact our support team by replying to this e-mail.</p>"
        self.msgHTML = self.msgHTML + "<p>Best regards from <b>" + Const.APP_SENDER_NAME + "</b>.</p>"

    def buildMsgTXT(self):

        self.msgTXT = "*** " + self.subject + " ***\n"
        self.msgTXT = self.msgTXT + "Hi " + self.toName + "!\n"
        self.msgTXT = self.msgTXT + "Here it goes you new password: " + self.newPwd + "\n"
        self.msgTXT = self.msgTXT + "If you did not request a new password please contact our support team by replying to this e-mail.\n"
        self.msgTXT = self.msgTXT + "Best regards from " + Const.APP_SENDER_NAME + " .\n"

    def sendNewPassword(self):

        self.buildMsgHTML()
        self.buildMsgTXT()

        return self.send()
