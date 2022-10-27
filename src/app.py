from flask import Flask, redirect

from routes.index import router as index
from routes.api.upload import router as api_upload
from routes.api.download import router as api_download
from utils.font import init as init_font
from utils.libjs import init as init_libjs

app = Flask(__name__, static_url_path="/", static_folder="public")
app.register_blueprint(index, url_prefix="/index")
app.register_blueprint(api_upload, url_prefix="/api/upload")
app.register_blueprint(api_download, url_prefix="/api/download")

init_font("1.3.0")
init_libjs("fc5e3c53e41490e24ca7f67cb24e7ab389b770f9")


@app.route("/")
def root():
    return redirect("index")
