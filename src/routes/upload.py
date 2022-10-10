from config import Config
from flask import Blueprint, redirect, render_template, request

router = Blueprint("upload", __name__)


@router.route("", methods=["POST"])
def upload():
    if request.method == "POST":
        if "file" in request.files:
            file = request.files["file"]
            print(file)

    return redirect("index")
