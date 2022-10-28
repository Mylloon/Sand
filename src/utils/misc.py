from hashlib import sha256

BYTEORDER = "big"


def exist(path: str) -> bool:
    """Check if file or directory exists"""
    try:
        open(path, "r")
    except FileNotFoundError:
        return False  # Doesn't exist
    except IsADirectoryError:
        return True  # Directory exists
    else:
        return True  # File exists


def int_to_bytes(data: int) -> bytes:
    """Convert int to bytes"""
    return data.to_bytes((data.bit_length() + 7) // 8, BYTEORDER)


def hash_data(string: str) -> str:
    """Hash a string"""
    return str(int.from_bytes(sha256(int_to_bytes(int(string))).digest(), BYTEORDER))
