from config import Config
from flask import Blueprint, redirect, render_template, request

router = Blueprint("upload", __name__)


@router.route("", methods=["POST"])
def upload():
    if request.method == "POST":
        print(request.get_data())
        data = request.form.get("file");
        if data == None:
            return redirect("index")
        else:
            print("Data received!")
