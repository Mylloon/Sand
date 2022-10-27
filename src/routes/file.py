from config import Config
from flask import Blueprint, render_template

router = Blueprint("file", __name__)


@router.route("<int:file_hash>/<string:key_data>")
def file(file_hash: int, key_data: str) -> str:
    """Download page"""
    print(f"hash : {file_hash}")
    key = key_data.split(":")
    print(f"key : {key}")
    return render_template("index.html", config=Config, download=True)
