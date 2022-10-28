from config import Config
from flask import Blueprint, render_template

router = Blueprint("file", __name__)


@router.route("<int:file_hash>")
def file(file_hash: int) -> str:
    """Download page"""
    print(f"hash : {file_hash}")
    return render_template("download.html", config=Config)
