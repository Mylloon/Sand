from config import Config
from flask import Blueprint, jsonify, redirect, request
from werkzeug.wrappers.response import Response

router = Blueprint("download", __name__)


@router.route("", methods=["POST"])
def download() -> Response:
    """Download interface (send file to javascript client)"""
    hash_data = request.get_json()
    if hash_data:
        data = ""
        with open(f"{Config.uploads_dir}/{hash_data}", 'r') as f:
            data = f.read()

        response = Config.database.get_filename(hash_data)
        response["file"] = data

        # Send the encrypted file to the javascript client
        return jsonify(response)

    return redirect("/file")
