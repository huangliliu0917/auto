import subprocess
import datetime
import time
import random
import requests
from bs4 import BeautifulSoup as bs

def genName():
    names = ['Lily', 'Angela', 'Eve', 'Tom', 'Jack', 'Betsy', 'Ida', 'Iris', 'Jill']
    name = random.choice(names)
    return name

def sendToWX():
    key = 'SCU53613T74bdd3a5e5ff2eb57218f74f71d495965d0711a8483e7'
    name = '昨日汇总'
    text = 'ooo'
    url = requests.get("https://sc.ftqq.com/{}.send?text={}&desp={}".format(key, name, text))

def getFakeInfo():
    url = 'https://www.myfakeinfo.com/mobile/get-android-device-information.php'
    res = requests.get(url)
    soup = bs(res.content, 'html.parser')
    info = {}
    for y in soup.find_all('div', attrs={'class': 'content'}):
        x = y.find_all('div')
        key, value = x[0].getText(), x[1].getText()
        info[key] = value
        if (len(x)) == 2:
            continue
        key, value = x[2].getText(), x[3].getText()
        info[key] = value
    print(info)


def checkVms():
    cmd = "ps axo pid,start,command|grep 'player --vm-name'"
    output = subprocess.Popen([cmd],stdout=subprocess.PIPE,shell=True).communicate()
    date = datetime.datetime.now().strftime("%Y-%m-%d ")
    for x in output[0].decode().split('\n'):
        y = x.split()
        if len(y) < 2:
            continue
        pid, timeText, cmd = y[0], y[1], y[2]
        startTime = datetime.datetime.strptime(date + timeText, "%Y-%m-%d %H:%M%p")
        if 'PM' in timeText:
            startTime += datetime.timedelta(hours=12)
        name = x.split('--vm-name')[-1]
        now = datetime.datetime.now()
        et = time.mktime(now.timetuple())
        st = time.mktime(startTime.timetuple())
        if (et - st) > 60 * 60:
            print('关闭( ' + name + ' )')
            cmd = 'kill -9 {0}&&pkill -9 adb'.format(pid)
            output = subprocess.Popen([cmd],stdout=subprocess.PIPE,shell=True).communicate()

def checkTime():
    cmd = "/Applications/Genymotion.app/Contents/MacOS/player.app/Contents/MacOS/tools/adb shell -s 192.168.56.109:5555 date `date +%m%d%H%M%G.%S`"
    output = subprocess.Popen([cmd],stdout=subprocess.PIPE,shell=True).communicate()
    print(output)


def main():
    print('开始检查虚拟机执行状态...')
    while True:
        checkTime()
        checkVms()
        print('sleep 180s')
        time.sleep(60)


if __name__ == "__main__":
    # main()
    # sendToWX()
    getFakeInfo()