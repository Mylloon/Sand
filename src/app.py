from flask import Flask, redirect

from font import init as init_font
from routes.index import router as index


app = Flask(__name__, static_url_path="/", static_folder="public")
app.register_blueprint(index, url_prefix="/index")

init_font("1.3.0")


@app.route("/")
def root():
    return redirect("index")
