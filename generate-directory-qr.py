#!/usr/bin/env python3
"""Regenerate public/legacy-portal/directory-qr.svg for the Switchboard entry.

Encodes a tel: link so scanning the QR code calls the switchboard directly.

Usage:
    python3 generate-directory-qr.py                 # reads Switchboard number from directory-data.csv
    python3 generate-directory-qr.py "01234 567890"   # override with a specific number

Requires the `qrcode` package (pip install qrcode).
"""
import re
import sys
from pathlib import Path

import qrcode
import qrcode.image.svg as svg

ROOT = Path(__file__).parent
CSV_PATH = ROOT / "directory-data.csv"
OUT_PATH = ROOT / "public" / "legacy-portal" / "directory-qr.svg"


def switchboard_number_from_csv():
    for line in CSV_PATH.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        fields = line.split(",")
        if fields[0].strip().lower() == "switchboard" and len(fields) > 1:
            return fields[1].strip()
    return ""


def main():
    number = sys.argv[1] if len(sys.argv) > 1 else switchboard_number_from_csv()
    if not number:
        print("No Switchboard number found. Pass one directly or set it in directory-data.csv.")
        sys.exit(1)

    digits = re.sub(r"[^\d+]", "", number)
    if not digits:
        print(f"'{number}' has no digits - not generating a QR code yet.")
        sys.exit(1)

    img = qrcode.make(f"tel:{digits}", image_factory=svg.SvgPathFillImage, border=2)
    img.save(str(OUT_PATH))
    print(f"Wrote {OUT_PATH} encoding tel:{digits}")


if __name__ == "__main__":
    main()
