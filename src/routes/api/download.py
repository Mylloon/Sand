from flask import Blueprint, redirect
from werkzeug.wrappers.response import Response

router = Blueprint("download", __name__)


@router.route("", methods=["POST"])
def download() -> Response:
    """Download interface"""
    # TODO: Send the encrypted file to the javascript client
    return redirect("index")
