from flask import Flask


app = Flask(__name__)


@app.route('/make_planning', methods=['Post'])
def make_planning():
    return "Planning is generating"

#To setup Flask use : 
# 1- Install python >= 3.6 before using flask
# 2- Run the commands : 
#   pip install Flask
#   $env:FLASK_APP = "generator"
#   $env:FLASK_ENV="development"

# To run the app execute 
#py -m flask run --port=4001

# YOU WILL GET SOMTHING LIKE THIS : 
    #* Serving Flask app 'generator' (lazy loading)
    #* Environment: development
    #* Debug mode: on
    #* Restarting with stat
    #* Debugger is active!
    #* Debugger PIN: 119-845-190
    #* Running on http://127.0.0.1:4001/ (Press CTRL+C to quit)

