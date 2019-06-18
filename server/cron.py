import subprocess
import datetime
import time
import random
import requests

import pymongo

db = pymongo.MongoClient().web

now = datetime.datetime.now() + datetime.timedelta(days=-1)
date = now.strftime('%Y%m%d')


def sendToWX():
    key = 'SCU53613T74bdd3a5e5ff2eb57218f74f71d495965d0711a8483e7'
    name = '昨日汇总'
    text = ''
    selector = {'date': date}
    eles = db.reading.find(selector).sort([('award', -1)])
    for ele in eles:
        name = ele.get('package_name', '')
        todayAward = ele.get('today_award', 0)
        award = ele.get('award', 0)
        line = '{} - {} - {}'.format(name, todayAward, award)
        text = text + line

    res = requests.get("https://sc.ftqq.com/{}.send?text={}&desp={}".format(key, name, text))
    print(text)
    print(res.content)



if __name__ == "__main__":
    # main()
    sendToWX()