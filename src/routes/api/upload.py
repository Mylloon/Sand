from config import Config
from flask import Blueprint, redirect, request
from utils.misc import h

router = Blueprint("upload", __name__)


@router.route("", methods=["POST"])
def upload():
    if request.method == "POST":
        json = request.get_json()
        if json:
            data = "".join(json["file"])
            data_hash = h(data)
            with open(f"{Config.uploads_dir}/{data_hash}", "w") as f:
                f.write(data)

    return redirect("index")
