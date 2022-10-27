from config import Config
from flask import Blueprint, render_template

router = Blueprint("uploaded", __name__)


@router.route("")
def uploaded() -> str:
    return render_template("index.html", name=Config.name)
