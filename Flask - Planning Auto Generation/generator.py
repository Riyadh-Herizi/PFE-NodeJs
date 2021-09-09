from flask import Flask
from flask import request
from flask import jsonify
from classes.GeneticAlgorithm import GeneticAlgorithm
from classes.Cours import Cours
from classes.Requirements import Requirements
from classes.TDPs import TDPs
from classes.Profs import Profs
app = Flask(__name__)


@app.route('/make_planning', methods=['Post'])
def make_planning():
     content = request.json
     cours = content["cours"]
     profs = content["profs"]
     tdps = content["tdps"]
     requirements = content["requirements"]
     planning = GeneticAlgorithm(Cours(cours),TDPs(tdps),Profs(profs),Requirements(requirements))
     planning.temp_planning= []
     planning.population = []
     planning.sessions= []
     planning.plannings= []
     planning.generate_planning()
     for element in planning.temp_planning :
          print(element["name"])
          print("-------------------------------------")
     if len(planning.plannings) == 0 : 
          return jsonify([])
     return jsonify(planning.plannings[0])

# To setup Flask use : 
# 1- Install python >= 3.6 before using flask and make sure that you have the path added on your system 
# 2- Run the commands : 
#   pip install Flask
#   $env:FLASK_APP = "generator"
#   $env:FLASK_ENV="development"

# To run the app execute 
# py -m flask run --port=4001

# YOU WILL GET SOMTHING LIKE THIS : 
    # * Serving Flask app 'generator' (lazy loading)
    # * Environment: development
    # * Debug mode: on
    # * Restarting with stat
    # * Debugger is active!
    # * Debugger PIN: 119-845-190
    # * Running on http://127.0.0.1:4001/ (Press CTRL+C to quit)

