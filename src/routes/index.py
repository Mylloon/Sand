from config import Config
from flask import Blueprint, render_template

router = Blueprint("index", __name__)


@router.route("")
def index() -> str:
    return render_template("index.html", name=Config.name)
