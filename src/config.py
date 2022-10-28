from os import mkdir

from utils.font import init as init_font
from utils.libjs import init as init_libjs
from utils.misc import exist
from utils.sqlite import FilesDB


class Config:
    """App configuration"""
    # App name
    name = "Sand"

    # Title of the desc in the index page
    title_desc = "Partage de petits fichiers"

    # Desc of the index page
    desc = "Sand permet le partage de fichiers. Attention, je n'accepte que \
            les petits fichiers de quelques <code>ko</code> car je chiffre via \
            RSA 🙂.<br><br>Ne supportes que les fichiers ASCII."

    # Footer of webpages
    footer = "NPNO"

    # Directory name where the uploads are stored
    uploads_dir = "uploads"

    # Database
    database = FilesDB(uploads_dir, "db.sqlite3")


def init() -> None:
    """Initialise everything before running the flask server"""
    # Download dependencies
    init_font("1.3.0")
    init_libjs("3.1.2")

    # Create upload folder if doesn't exists
    if not exist(Config.uploads_dir):
        mkdir(Config.uploads_dir)
