from time import time

from config import Config
from flask import Blueprint, redirect, request, jsonify
from utils.misc import hash_data
from werkzeug.wrappers.response import Response

router = Blueprint("upload", __name__)


@router.route("", methods=["POST"])
def upload() -> Response:
    """Upload interface (receive file from javascript client)"""
    json = request.get_json()
    if json:
        data = "".join(json["file"])
        data_hash = hash_data(data)
        with open(f"{Config.uploads_dir}/{data_hash}", 'w') as f:
            f.write(data)

        Config.database.add_file(data_hash, int(time()))

        # Send the hash to the javascript client
        return jsonify(data_hash)

    return redirect("/index")
