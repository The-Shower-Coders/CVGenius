from bardapi import Bard
import os
print(Bard(token=os.environ.get('BARD_TOKEN')).get_answer(os.sys.argv[1])['content'])