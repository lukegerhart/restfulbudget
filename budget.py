from flask import Flask, jsonify, render_template
from flask_restful import Resource, Api, reqparse, abort
from datetime import date
app = Flask(__name__)
api = Api(app)
purchases = [
	{'amount': 50, 'bought': 'food', 'date': "2017-11-01", 'category': 'testcat'}
]
categories = [
	{'testcat': {'limit': 100, 'purchases': [purchases[0]]}}
]

category_parser = reqparse.RequestParser()
category_parser.add_argument('name')
category_parser.add_argument('limit', type=int)

purchase_parser = reqparse.RequestParser()
purchase_parser.add_argument('amount', type=int)
purchase_parser.add_argument('bought')
purchase_parser.add_argument('date')
purchase_parser.add_argument('category')

purchase_get_parser = reqparse.RequestParser()
purchase_get_parser.add_argument('month')
class Category(Resource):
	def get(self):
		return jsonify(categories)
		#return categories
	def post(self):
		args = category_parser.parse_args()
		keys = [list(cat)[0] for cat in categories]
		print(keys)
		if args['name'] in keys:
			abort(400, description="Category already exists")
		newcat = {}
		newcat[args['name']] = {'limit': int(args['limit']), 'purchases':[]}
		categories.append(newcat)
		return newcat, 201
		
	def delete(self):
		args = category_parser.parse_args()
		i = 0
		for index in range(0, len(categories)):
			if args['name'] in categories[index]:
				i = index
		del categories[i]
		for purchase in purchases:
			if purchase['category'] == args['name']:
				purchase['category'] = ''
		return None, 204

class Purchase(Resource):
	
	def get(self):
		#"""
		args = purchase_get_parser.parse_args()
		if args['month']:
			purch = [purchase for purchase in purchases if purchase['date'].split('-')[1] == month]
			print(purch)
			return jsonify(purch)	
		else:
			return jsonify(purchases)
		#"""
		#return jsonify(purchases)
	def put(self):
		args = purchase_parser.parse_args()
		cat_name = args['category']
		keys = [list(cat)[0] for cat in categories]
		if cat_name not in keys:
			abort(400, description="Category does not exist")
		newpurchase = {}
		newpurchase['amount'] = args['amount']
		newpurchase['bought'] = args['bought']
		d = args['date'].split('-')
		newpurchase['date'] = str(date(int(d[0]), int(d[1]), int(d[2])))
		newpurchase['category'] = cat_name
		purchases.append(newpurchase)
		for cat in categories:
			if cat_name in cat:
				cat[cat_name]['purchases'].append(newpurchase)
		return newpurchase, 201

@app.route("/")
def home():
	return render_template("homepage.html")

api.add_resource(Category, '/cats')
api.add_resource(Purchase, '/purchases')
