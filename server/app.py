from flask import Flask
from flask import request, jsonify
import time
from flask_mongoengine import MongoEngine
import pymongo

db = pymongo.MongoClient().web

app = Flask(__name__)
# db = MongoEngine()
# db.init_app(app)

# class Reading(db.Document):
#     app_name = db.StringField()
#     packageName = db.StringField()
#     todayAward = db.IntField()
#     Award = db.IntField()
#     date = db.StringField()
#     updateTime = db.IntField()
#     meta = {
#         "indexes": [
#             "app_name",
#             "date",
#         ],
#         'ordering': ['-update_time'],
#         'collection': 'reading',

#     }

def setup_app():
    return app

@app.route('/ping')
def ping():
    return jsonify({'msg': 'pong'})

@app.route('/report', methods=['POST'])
def report():
    args = request.form
    sign = args.get('sign', '')
    if (not sign or sign != 'august'):
        return jsonify({'errMsg': 1})

    todayAward = args.get('today_award', 0)
    award = args.get('award', 0)
    if (!todayAward && !award):
        return jsonify({'errMsg': 1})
    packageName = args.get('package_name', '')
    appName = args.get('app_name', '')
    date = time.strftime('%Y%m%d')
    updateTime = int(time.time())
    update = {
        'today_award': todayAward,
        'award': award,
        'package_name': packageName,
        'date': date,
        'update_time': updateTime,
    }
    updater = {'$set': update}
    selector = {'app_name': appName, 'date': date}
    db.reading.update_one(selector, updater, upsert=True)


    return jsonify({'errMsg': 0})


if __name__ == '__main__':
    app.run(host='0.0.0.0')
