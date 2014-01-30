import unittest
import logging
from modules.models.user import *
from modules.toolbox.util import *

'''
EXEMPLO
class SuccessFailError(unittest.TestCase):

    def setUp(self):
        logging.info('In setUp()')
        
    def tearDown(self):
        logging.info('In tearDown()')

    def test_success(self):
        logging.info('Running test_success()')
        self.assertTrue(True)
    
    #This test causes an intentional failure.
    def test_failure(self):
        logging.info('Running test_failure()')
        self.assertTrue(False)

    # This test causes an intentional error.
    def test_error(self):
        logging.info('Running test_error()')
        raise Exception('expected exception')
'''


class UserTest(unittest.TestCase):
    
    name = "Sayyes da Silva"
    email = "support@sayyes.cc"
    
    def setUp(self):
        util = Util()
        # Populate test entities.
        user = User()
        user.name = self.name
        usrEmail = User.query(User.email == self.email).get()
        if usrEmail is not None:
            raise UserWarning("This e-mail has already been registered")
        user.email = self.email
        user.companyName = "SayYes! Co"
        user.pwd = util.hash("123456")
        user.website = "http://www.sayyes.cc"
        user.accessKey = util.generatePwd(12)
        self.setupKey = user.put()

    def tearDown(self):
        # There is no need to delete test entities.
        pass
    
    def testSetupEntity(self):
        entity = self.setupKey.get()
        self.assertEqual(self.name, entity.name)
        

