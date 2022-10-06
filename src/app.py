from routes.index import router as index
from flask import Flask, redirect


app = Flask(__name__, static_url_path="/", static_folder="public")
app.register_blueprint(index, url_prefix="/index")


@app.route("/")
def root():
    return redirect("index")


class AttributeDict(dict):
    def __getattr__(self, name):
        if name in self:
            return self[name]
        raise AttributeError(name)
