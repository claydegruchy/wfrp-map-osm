import os
import json
import requests
from urllib.parse import urlparse

INPUT_JSON = "data.json"
OUTPUT_DIR = "output"

with open(INPUT_JSON, "r", encoding="utf-8") as f:
	data = json.load(f)

os.makedirs(OUTPUT_DIR, exist_ok=True)

result = {}

for item in data:
	print("starting new image")
	item_id = item["id"]
	images = item.get("images", [])

	id_dir = os.path.join(OUTPUT_DIR, item_id)
	os.makedirs(id_dir, exist_ok=True)

	result[item_id] = []

	for index, url in enumerate(images):
		parsed = urlparse(url)
		ext = os.path.splitext(parsed.path)[1] or ".jpg"

		filename = f"{item_id}_{index}{ext}"
		filepath = os.path.join(id_dir, filename)

		response = requests.get(url, timeout=30)
		response.raise_for_status()

		with open(filepath, "wb") as f:
			f.write(response.content)

		result[item_id].append(filepath)

with open("images_index.json", "w", encoding="utf-8") as f:
	json.dump(result, f, indent=4)

print("Done.")
