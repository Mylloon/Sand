from config import Config
from flask import Blueprint, jsonify, redirect, request
from werkzeug.wrappers.response import Response

router = Blueprint("download", __name__)


@router.route("", methods=["POST"])
def download() -> Response:
    """Download interface (send file to javascript client)"""
    json = request.get_json()
    if json:
        data = ""
        with open(f"{Config.uploads_dir}/{json}", 'r') as f:
            data = f.read()

        # Send the encrypted file to the javascript client
        return jsonify(data)

    return redirect("/file")
