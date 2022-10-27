from flask import Flask, redirect
from werkzeug.wrappers.response import Response

from config import init
from routes.api.download import router as api_download
from routes.api.upload import router as api_upload
from routes.index import router as index
from routes.uploaded import router as uploaded

app = Flask(__name__, static_url_path="/", static_folder="public")
app.register_blueprint(index, url_prefix="/index")
app.register_blueprint(uploaded, url_prefix="/uploaded")
app.register_blueprint(api_upload, url_prefix="/api/upload")
app.register_blueprint(api_download, url_prefix="/api/download")

init()


@app.route("/")
def root() -> Response:
    return redirect("index")
