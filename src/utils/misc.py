from hashlib import sha256
from sys import set_int_max_str_digits

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


def h(data: str) -> str:
    """Hash un texte"""
    # https://docs.python.org/3/library/sys.html#sys.set_int_max_str_digits
    set_int_max_str_digits(len(data))
    return str(int.from_bytes(sha256(int_to_bytes(int(data))).digest(), BYTEORDER))
