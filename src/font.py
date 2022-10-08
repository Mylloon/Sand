from os import mkdir

from requests import get


def exist(path):
    """Check if file or directory exists"""
    try:
        open(path, "r")
    except FileNotFoundError:
        return False  # Doesn't exist
    except IsADirectoryError:
        return True  # Directory exists
    else:
        return True  # File exists


def init(version):
    """ Download font """
    path = "./src/public/fonts"
    filename = "RiluRegular.ttf"
    # If there is filename changes, you should change
    # the name in the css file too (./src/public/styles/style.css)

    # Check if fonts directory exists
    if not exist(path):
        mkdir(path)

    # TODO: Store the version used and redownload on version changes

    # Download the font file if needed
    if not exist(f"{path}/{filename}"):
        # Download the font file
        file_url = f"https://github.com/alisinisterra/rilu/releases/download/v{version}/{filename}"
        data = get(file_url).content

        # Save the file
        with open(f"{path}/{filename}", "wb") as file:
            file.write(data)
