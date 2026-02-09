#!/usr/bin/env python3
"""
QR Code Generator Script
Generates QR codes from URLs/links and saves them as PNG images.
"""

import qrcode
import argparse
import os
from PIL import Image


def generate_qr_code(url, filename=None, size=10, border=4, fill_color="black", back_color="white"):
    """
    Generate a QR code from a URL and save it as an image.
    
    Args:
        url (str): The URL or text to encode in the QR code
        filename (str): Output filename (optional, defaults to qr_code.png)
        size (int): Size of the QR code (default: 10)
        border (int): Border size around QR code (default: 4)
        fill_color (str): Color of the QR code (default: "black")
        back_color (str): Background color (default: "white")
    """
    if filename is None:
        # Generate filename from URL if not provided
        safe_url = "".join(c for c in url if c.isalnum() or c in ('-', '_')).rstrip()
        filename = f"qr_{safe_url[:20]}.png" if safe_url else "qr_code.png"
    
    # Ensure filename has .png extension
    if not filename.lower().endswith('.png'):
        filename += '.png'
    
    # Create QR code instance
    qr = qrcode.QRCode(
        version=1,  # controls the size of the QR Code
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=size,
        border=border,
    )
    
    # Add data and optimize
    qr.add_data(url)
    qr.make(fit=True)
    
    # Create an image from the QR Code instance
    img = qr.make_image(fill_color=fill_color, back_color=back_color)
    
    # Save the image
    img.save(filename)
    print(f"QR code generated successfully: {filename}")
    print(f"URL: {url}")
    print(f"Image size: {img.size}")
    
    return filename


def main():
    parser = argparse.ArgumentParser(description="Generate QR codes from URLs/links")
    parser.add_argument("url", help="URL or text to encode in QR code")
    parser.add_argument("-f", "--filename", help="Output filename (optional)")
    parser.add_argument("-s", "--size", type=int, default=10, help="QR code size (default: 10)")
    parser.add_argument("-b", "--border", type=int, default=4, help="Border size (default: 4)")
    parser.add_argument("--fill-color", default="black", help="QR code color (default: black)")
    parser.add_argument("--back-color", default="white", help="Background color (default: white)")
    
    args = parser.parse_args()
    
    try:
        generate_qr_code(
            url=args.url,
            filename=args.filename,
            size=args.size,
            border=args.border,
            fill_color=args.fill_color,
            back_color=args.back_color
        )
    except Exception as e:
        print(f"Error generating QR code: {e}")
        return 1
    
    return 0


if __name__ == "__main__":
    exit(main())
