from os import mkdir

from utils.font import init as init_font
from utils.libjs import init as init_libjs
from utils.misc import exist


class Config:
    name = "Sand"
    uploads_dir = "uploads"


def init():
    # Download dependencies
    init_font("1.3.0")
    init_libjs("fc5e3c53e41490e24ca7f67cb24e7ab389b770f9")

    # Create upload folder if doesn't exists
    if not exist(Config.uploads_dir):
        mkdir(Config.uploads_dir)
