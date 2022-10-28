from os import mkdir
from sqlite3 import connect

from utils.misc import exist


class Database:
    """Handle SQLite3 database"""

    def __init__(self, path: str, filename: str) -> None:
        if not exist(path):
            mkdir(path)

        fullpath = f"{path}/{filename}"
        if not exist(fullpath):
            open(fullpath, 'x')

        self.fullpath = fullpath

    def request(self, request: str, valeurs=None) -> tuple:
        """Send a request to the database"""
        connection = connect(self.fullpath)
        cursor = connection.cursor()
        if valeurs:
            if type(valeurs) not in [list, tuple]:
                valeurs = [valeurs]
            cursor.execute(request, valeurs)
        else:
            cursor.execute(request)

        connection.commit()

        return cursor, cursor.lastrowid

    def format(self, keys, cursor: tuple) -> dict:
        """Format sqlite request's result as dict"""
        values = []
        if cursor[0] != None:
            datas = cursor[0].fetchall()
            for data in datas[0]:
                values.append(data)

        if type(keys) not in [list, tuple]:
            keys = [keys]

        if len(keys) != len(values):
            print(keys, values)
            raise IndexError

        return dict(zip(keys, values))


class FilesDB(Database):
    """Handle files in sqlite3 database"""

    def __init__(self, path: str, filename: str) -> None:
        super().__init__(path, filename)
        self.table_name = "files"

        self.request(
            f"CREATE TABLE IF NOT EXISTS {self.table_name} \
              (hash TEXT, filename TEXT);")

    def add_file(self, hash_file: str, filename: str) -> None:
        """Add a file"""
        self.request(
            f"INSERT INTO {self.table_name} (hash, filename) VALUES (?, ?);",
            [hash_file, filename])

    def remove_file(self, hash_file: str) -> None:
        """Remove a file"""
        self.request(
            f"DELETE FROM {self.table_name} WHERE hash = ?", hash_file)

    def get_filename(self, hash_file: str) -> dict:
        """Return the filename of a specific file"""
        query = "filename"
        return self.format(query, self.request(
            f"SELECT {query} FROM {self.table_name} WHERE hash = ?", hash_file))
