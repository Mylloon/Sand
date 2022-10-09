from flask import Flask, redirect

from routes.index import router as index
from routes.upload import router as upload
from utils.font import init as init_font

app = Flask(__name__, static_url_path="/", static_folder="public")
app.register_blueprint(index, url_prefix="/index")
app.register_blueprint(upload, url_prefix="/upload")

init_font("1.3.0")


@app.route("/")
def root():
    return redirect("index")
