from flask import Blueprint, redirect
from werkzeug.wrappers.response import Response

router = Blueprint("download", __name__)


@router.route("<file_hash>", methods=["POST"])
def download(file_hash: str) -> Response:
    """Download interface"""
    # TODO: Send the encrypted file to the javascript client
    print("download of file", file_hash)
    return redirect("index")
