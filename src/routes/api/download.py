from flask import Blueprint, redirect
from werkzeug.wrappers.response import Response

router = Blueprint("download", __name__)


@router.route("", methods=["POST"])
def download() -> Response:
    return redirect("index")
