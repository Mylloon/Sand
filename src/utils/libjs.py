from os import mkdir

from requests import get

from utils.misc import exist


def init(commit_hash):
    """ Download JS libraries"""
    path = "./src/public/js/libs"
    filename = "bigint-mod.js"
    # If there is filename changes, you should change
    # the name in the js imports too (./src/public/js/rsa.js)

    # Check if js/lib directory exists
    if not exist(path):
        mkdir(path)

    # TODO: Store the version used and redownload on version changes

    # Download the js file if needed
    if not exist(f"{path}/{filename}"):
        # Download the font file
        file_url = f"https://raw.githubusercontent.com/juanelas/bigint-mod-arith/{commit_hash}/dist/esm/index.browser.js"
        data = get(file_url).content

        # Save the file
        with open(f"{path}/{filename}", "wb") as file:
            file.write(data)
