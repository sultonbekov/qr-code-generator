#!/usr/bin/env python3
"""
Example usage of the QR code generator
"""

from qr_generator import generate_qr_code

# Example 1: Basic QR code from URL
generate_qr_code("youtube.com", "youtube_qr.png")

# Example 2: QR code with custom colors
generate_qr_code(
    url="youtube.com",
    filename="github_qr.png",
    fill_color="blue",
    back_color="lightgray"
)

# Example 3: QR code from text
generate_qr_code(
    url="Привет, мир!",
    filename="hello_world_qr.png",
    size=15,
    border=3
)

print("All example QR codes generated successfully!")
