from PIL import Image, ImageDraw, ImageFont
import pillow_avif
import os

base_path = "/Users/mecarr/Library/Mobile Documents/com~apple~CloudDocs/Political Dating"

# Load Biden image and save as PNG to examine
biden_img = Image.open(os.path.join(base_path, "joe-biden-gettyimages-1267438366.avif"))
biden_img.save(os.path.join(base_path, "biden_original.png"), 'PNG')
print(f"Biden original size: {biden_img.size}")

# Show what we're working with
# Biden image is 3840x1920 - very wide, his face is likely somewhere specific
# Let's crop to center on his face - typically in editorial photos, face is in upper-center

# Crop Biden to get his face (estimate based on typical portrait positioning)
biden_w, biden_h = biden_img.size

# For a 3840x1920 image, face is likely in the center-upper portion
# Let's take a 1920x1920 square from the center
crop_size = biden_h  # 1920
left = (biden_w - crop_size) // 2  # Center horizontally
biden_face = biden_img.crop((left, 0, left + crop_size, crop_size))
biden_face.save(os.path.join(base_path, "biden_face_crop.png"), 'PNG')
print(f"Biden face crop size: {biden_face.size}")
