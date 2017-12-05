from flask import Flask, jsonify, render_template
from flask_restful import Resource, Api, reqparse, abort

app = Flask(__name__)
api = Api(app)
purchases = [
	{'amount': 50, 'bought': 'food', 'date': '12-5-2017', 'category': 'testcat'},
	{'amount': 50, 'bought': 'food', 'date': '12-5-2017', 'category': 'testcat'}
]
categories = {
	'testcat': {'limit': 100, 'purchases': []}
}

category_parser = reqparse.RequestParser()
category_parser.add_argument('name')
category_parser.add_argument('limit', type=int)

purchase_parser = reqparse.RequestParser()
purchase_parser.add_argument('amount', type=int)
purchase_parser.add_argument('bought')
purchase_parser.add_argument('date')
purchase_parser.add_argument('category')

class Category(Resource):
	def get(self):
		return jsonify(categories)
		#return categories
	def post(self):
		args = category_parser.parse_args()
		categories[args['name']] = {'limit': int(args['limit']), 'purchases':[]}
		return categories[args['name']], 201
		
	def delete(self):
		args = category_parser.parse_args()
		del categories[args['name']]
		return None, 204

class Purchase(Resource):
	
	def get(self):
		return jsonify(purchases)
	
	def put(self):
		args = purchase_parser.parse_args()
		cat_name = args['category']
		if cat_name not in categories:
			abort(400, description="Category does not exist")
		newpurchase = {}
		newpurchase['amount'] = args['amount']
		newpurchase['bought'] = args['bought']
		newpurchase['date'] = args['date']
		newpurchase['category'] = cat_name
		purchases.append(newpurchase)
		categories[cat_name]['purchases'].append(newpurchase)
		return newpurchase, 201

@app.route("/")
def home():
	return render_template("homepage.html")

api.add_resource(Category, '/cats')
api.add_resource(Purchase, '/purchases')
