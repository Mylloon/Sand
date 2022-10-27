from flask import Blueprint, redirect, request

router = Blueprint("upload", __name__)


@router.route("", methods=["POST"])
def upload():
    if request.method == "POST":
        print(request.get_data())

    return redirect("index")
