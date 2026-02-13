import base64
import json
import sys
from pathlib import Path

encrypted_filename = Path("./assets/plz.json")
decrypted_filename = Path("./assets/plz-plain.json")


def decrypt():
    with open(encrypted_filename) as f:
        data = json.load(f)
    data = [
        {**x, **{"E-Mail": base64.b64decode(x["E-Mail"]).decode("utf-8")}} for x in data
    ]
    with open(decrypted_filename, "w") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def encrypt():
    with open(decrypted_filename) as f:
        data = json.load(f)
    data = [
        {
            **x,
            **{"E-Mail": base64.b64encode(x["E-Mail"].encode("utf-8")).decode("utf-8")},
        }
        for x in data
    ]
    with open(encrypted_filename, "w") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    arg = sys.argv[1]
    if arg == "decrypt":
        decrypt()
    elif arg == "encrypt":
        encrypt()
    else:
        print("Bad argument")
