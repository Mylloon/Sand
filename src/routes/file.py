from config import Config
from flask import Blueprint, render_template

router = Blueprint("file", __name__)


@router.route("<int:_>")
def file(_: int) -> str:
    """Download page"""
    return render_template("download.html", config=Config)
