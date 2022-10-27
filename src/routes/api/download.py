from flask import Blueprint, redirect, request

router = Blueprint("download", __name__)


@router.route("", methods=["POST"])
def download():
    return redirect("index")
