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
