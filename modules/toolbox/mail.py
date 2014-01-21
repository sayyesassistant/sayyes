from google.appengine.api import mail
from modules.toolbox.util import *

class MailSender(object):

    msgHTML = None
    msgTXT = None
    toName = None
    toEmail = None
    subject = None
    sender = Const.APP_SENDER_NAME + " <" + Const.APP_SENDER_EMAIL + ">"

    def send(self):

        message = mail.EmailMessage(sender=self.sender, subject=self.subject + " - Say Yes! Assistant")
        message.to = self.toName + " <" + self.toEmail + ">"
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

    def __buildMsgHTML(self):

        self.msgHTML = "<p><b>*** " + self.subject + " ***</b></p>"
        self.msgHTML = self.msgHTML + "<p>Hi " + self.toName + "!</p>"
        self.msgHTML = self.msgHTML + "<p>Here it goes you new password: <b>" + self.newPwd + "</b></p>"
        self.msgHTML = self.msgHTML + "<p>If you did not request a new password please contact our support team by replying to this e-mail.</p>"
        self.msgHTML = self.msgHTML + "<p>Best regards from <b>" + Const.APP_SENDER_NAME + "</b>.</p>"

    def __buildMsgTXT(self):

        self.msgTXT = "*** " + self.subject + " ***\n"
        self.msgTXT = self.msgTXT + "Hi " + self.toName + "!\n"
        self.msgTXT = self.msgTXT + "Here it goes you new password: " + self.newPwd + "\n"
        self.msgTXT = self.msgTXT + "If you did not request a new password please contact our support team by replying to this e-mail.\n"
        self.msgTXT = self.msgTXT + "Best regards from " + Const.APP_SENDER_NAME + " .\n"

    def sendNewPassword(self):

        self.__buildMsgHTML()
        self.__buildMsgTXT()

        return self.send()
