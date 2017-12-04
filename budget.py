from flask import Flask, jsonify
from flask_restful import Resource, Api

app = Flask(__name__)
api = Api(app)

categories = []

class Category(Resource):
	def get(self):
		return jsonify(categories)
		
	def put(self, cat_name):
		pass
		
	def delete(self, cat_name):
		pass
		
api.add_resource(Category, '/cats')