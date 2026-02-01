from PIL import Image, ImageDraw, ImageFont
import pillow_avif
import os

base_path = "/Users/mecarr/Library/Mobile Documents/com~apple~CloudDocs/Political Dating"

# Load source images
trump_biden_merged = Image.open(os.path.join(base_path, "trump_biden_merged.png"))
biden_full_img = Image.open(os.path.join(base_path, "joe-biden-gettyimages-1267438366.avif"))

# Final dimensions
width, height = 800, 600

# For Trump: use the merged image which has Trump on the left
# The merged image (318x159) has Trump's face visible - scale it up
trump_img = trump_biden_merged.resize((width, height), Image.Resampling.LANCZOS)

# For Biden: crop from the full image to get his face centered
# The full Biden image is 3840x1920, face is in center
biden_w, biden_h = biden_full_img.size
# Crop a square around Biden's face 
crop_left = (biden_w - biden_h) // 2  # Center horizontally
biden_cropped = biden_full_img.crop((crop_left, 0, crop_left + biden_h, biden_h))
# Flip Biden horizontally so his face appears on the right side of the image
biden_flipped = biden_cropped.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
biden_img = biden_flipped.resize((width, height), Image.Resampling.LANCZOS)

# Create canvas
canvas = Image.new('RGB', (width, height), (0, 0, 0))

# Create zigzag split - Mario Kart VS style
center_x = width // 2
zigzag_amplitude = 50
num_zags = 5

# Build zigzag points
zigzag_points = []
for i in range(num_zags + 1):
    y = (height / num_zags) * i
    if i % 2 == 0:
        x = center_x - zigzag_amplitude
    else:
        x = center_x + zigzag_amplitude
    zigzag_points.append((x, y))

# Create masks
trump_mask = Image.new('L', (width, height), 0)
biden_mask = Image.new('L', (width, height), 0)

draw_trump = ImageDraw.Draw(trump_mask)
draw_biden = ImageDraw.Draw(biden_mask)

# Trump polygon (left of zigzag)
trump_polygon = [(0, 0)] + zigzag_points + [(0, height)]
draw_trump.polygon(trump_polygon, fill=255)

# Biden polygon (right of zigzag)
biden_polygon = [(width, 0)] + list(reversed(zigzag_points)) + [(width, height)]
draw_biden.polygon(biden_polygon, fill=255)

# Composite the images
canvas.paste(trump_img, (0, 0), trump_mask)
canvas.paste(biden_img, (0, 0), biden_mask)

# Draw dramatic zigzag line
draw_canvas = ImageDraw.Draw(canvas)

# White border
for i in range(len(zigzag_points) - 1):
    draw_canvas.line([zigzag_points[i], zigzag_points[i+1]], fill=(255, 255, 255), width=16)

# Black center
for i in range(len(zigzag_points) - 1):
    draw_canvas.line([zigzag_points[i], zigzag_points[i+1]], fill=(0, 0, 0), width=8)

# Add bold "VS" text
try:
    font = ImageFont.truetype("/System/Library/Fonts/Times.ttc", 150)
except:
    font = ImageFont.load_default()

text = "VS"
bbox = draw_canvas.textbbox((0, 0), text, font=font)
text_width = bbox[2] - bbox[0]
text_height = bbox[3] - bbox[1]

text_x = (width - text_width) // 2
text_y = (height - text_height) // 2 - 20

# White outline
outline = 5
for dx in range(-outline, outline + 1):
    for dy in range(-outline, outline + 1):
        if dx != 0 or dy != 0:
            draw_canvas.text((text_x + dx, text_y + dy), text, font=font, fill=(255, 255, 255))

# Black text
draw_canvas.text((text_x, text_y), text, font=font, fill=(0, 0, 0))

# Save
output_path = os.path.join(base_path, "trump_vs_biden.png")
canvas.save(output_path, 'PNG')
print(f"Saved: {output_path}")
