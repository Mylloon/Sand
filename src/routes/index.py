from flask import Blueprint, render_template
from config import Config

router = Blueprint("index", __name__)


@router.route("")
def index():
    return render_template("index.html", name=Config.name)
