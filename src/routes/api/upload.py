from time import time

from config import Config
from flask import Blueprint, redirect, request
from utils.misc import h
from werkzeug.wrappers.response import Response

router = Blueprint("upload", __name__)


@router.route("", methods=["POST"])
def upload() -> Response:
    """Upload interface (receive file from javascript client)"""
    if request.method == "POST":
        json = request.get_json()
        if json:
            data = "".join(json["file"])
            data_hash = h(data)
            with open(f"{Config.uploads_dir}/{data_hash}", 'w') as f:
                f.write(data)

            Config.database.add_file(data_hash, int(time()))

    return redirect("/index")
