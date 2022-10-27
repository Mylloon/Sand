from os import mkdir

from utils.font import init as init_font
from utils.libjs import init as init_libjs
from utils.misc import exist
from utils.sqlite import FilesDB


class Config:
    # App name
    name = "Sand"

    # Title of the desc in the index page
    title_desc = "Partage de petits fichiers"

    # Desc of the index page
    desc = "Sand permet le partage de fichiers. Attention, je n'accepte que \
            les petits fichiers de quelques <code>ko</code> car je chiffre ton \
            fichier via RSA 🙂.<br><br>Les fichiers sont herbergés 24 heures."

    # Directory name where the uploads are stored
    uploads_dir = "uploads"

    # Database
    database = FilesDB(uploads_dir, "db.sqlite3")


def init() -> None:
    # Download dependencies
    init_font("1.3.0")
    init_libjs("fc5e3c53e41490e24ca7f67cb24e7ab389b770f9")

    # Create upload folder if doesn't exists
    if not exist(Config.uploads_dir):
        mkdir(path=Config.uploads_dir)

# TODO: Clear every t mins the uploads directory and database
# TODO: On init, check if files in db are corresponding to the files stored
#       in the uploads_dir (for example if some files are on the disk and not
#       in the database)
