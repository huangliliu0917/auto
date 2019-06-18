import subprocess
import threading
from multiprocessing import Pool


# cmd = "/Applications/Genymotion\ Shell.app/Contents/MacOS/genyshell -c 'devices list'"

def getVms():
    vms = []
    cmd = "VBoxManage list vms"
    output = subprocess.Popen([cmd],stdout=subprocess.PIPE,shell=True).communicate()
    print(cmd)
    out = output[0].decode()
    for x in out.split('\n'):
        vm = {}
        y = x.split('"')
        if len(y) < 2:
            continue
        name = y[1]
        uuid = y[2][2:-1]
        print(name, uuid)
        vm['name'] = name
        vm['uuid'] = uuid
        vms.append(vm)
    return vms

def worker(cmd):
    output = subprocess.Popen([cmd],stdout=subprocess.PIPE,shell=True).communicate()

def main():
    # 定义一个进程池
    pool = Pool(2)
    vms = getVms()
    print('共有{0}台虚拟机...'.format(len(vms)))
    ret = []
    for vm in vms:
        name = vm['name']
        uuid = vm['uuid']
        cmd = "/Applications/Genymotion.app/Contents/MacOS/player.app/Contents/MacOS/player --vm-name '{0}'".format(name)
        pool.apply_async(worker, (cmd,)) # 非阻塞方式执行

    pool.close()
    pool.join()


if __name__ == "__main__":
    main()


# cmd = "/Applications/Genymotion\ Shell.app/Contents/MacOS/genyshell -c '{0}'"


# 启动
# cmd = "/Applications/Genymotion.app/Contents/MacOS/player.app/Contents/MacOS/player --vm-name '4e7b0e89-ca39-4ff6-a613-fde1debe0379'"

# 关闭
# 根据name关闭
# kill -9 
# cmd = 'ps aux|grep player'