""" 

copying folder in goolge collab

"""
# import shutil

# src = "/content/drive/MyDrive/data"
# dest = "/content/data"

# shutil.copytree(src, dest, dirs_exist_ok=True)  # Copies all files and subdirectories
# print("✅ Folder copied successfully!")





# !rsync -av "/content/drive/MyDrive/data/" "/content/data/"


"""

deleting a folder in collab

"""

# import shutil

# folder_path = "/content/datasets"
# shutil.rmtree(folder_path, ignore_errors=True)

# print(f"✅ Deleted {folder_path}")



"""

searching image from googe and downloading

"""
# from google_images_search import GoogleImagesSearch
# import os

# # Replace with your own Google Custom Search API key & CX
# API_KEY = "your-api-key"
# CX = ""

# # Initialize Google Image Search
# gis = GoogleImagesSearch(API_KEY, CX)

# # Search parameters
# search_params = {
#     'q': 'robbery, theft images',
#     'num': 20,  # Number of images to download
#     'safe': 'off',
#     'fileType': 'jpg|png',
#     'imgSize': 'medium'
# }

# # Directory to save images
# save_dir = "Theft"
# os.makedirs(save_dir, exist_ok=True)

# # Perform the image search
# gis.search(search_params)

# # Download images
# for i, image in enumerate(gis.results()):
#     image.download(save_dir)
#     print(f"Downloaded {i+1}/{search_params['num']}")

# print("Download complete!")

"""

changing the image name squentially

"""
# import os

# def rename_images(directory, prefix='theft'):
#     image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'}
    
#     if not os.path.exists(directory):
#         print(f"Error: Directory '{directory}' not found.")
#         return

#     images = [f for f in os.listdir(directory) if os.path.splitext(f)[1].lower() in image_extensions]
    
#     if not images:
#         print("Error: No images found in the directory.")
#         return

#     images.sort()
    
#     for index, filename in enumerate(images, start=1):
#         old_path = os.path.join(directory, filename)
#         ext = os.path.splitext(filename)[1].lower()  # Keep original extension
#         new_name = f"{prefix}_{index}.jpg"
#         new_path = os.path.join(directory, new_name)

#         try:
#             os.rename(old_path, new_path)
#             print(f"Renamed: {filename} -> {new_name}")

#         except Exception as e:
#             print(f"Error renaming {filename}: {e}")

# # Example usage
# directory_path = "Theft"  # Change this to your actual directory
# rename_images(directory_path)




"""

to make the model saved by our own name 

"""


# import shutil
# shutil.move("type/detect/train14/weights/best.pt", "my_model.pt")




"""

taking the csv file and changing the image path sequentialy

"""
# import pandas as pd
# # Load CSV file
# file_path = "./data/alertX.csv"  # Replace with your actual file path
# df = pd.read_csv(file_path)

# # Define base path
# base_path = "./data/images/drink_drive_"

# # Check if required columns exist
# if "Type of Incident" in df.columns and "Media Attachments" in df.columns:
#     # Filter only "Fire" incidents
#     fire_indices = df[df["Type of Incident"].str.lower() == "drink and drive"].index
    
#     # Assign unique file paths
#     for i, index in enumerate(fire_indices, start=1):
#         df.at[index, "Media Attachments"] = f"{base_path}{i}.jpg"
    
#     # Overwrite the same file with updated data
#     df.to_csv(file_path, index=False)
#     print(f"CSV file '{file_path}' updated successfully.")
# else:
#     print("Error: Required columns not found in CSV.")



"""

droping null values from the table

"""

# import pandas as pd

# def remove_empty_rows(csv_file):
#     df = pd.read_csv(csv_file)

#     # Drop rows where all values are empty
#     df.dropna(how='all', inplace=True)

#     # Save changes back to the same file
#     df.to_csv(csv_file, index=False)
#     print(f"✅ Empty rows removed from '{csv_file}'")

# # Example usage
# csv_file = "./data/alertX.csv"  # Replace with your CSV file
# remove_empty_rows(csv_file)

"""

make txt file as per yolo format

"""


# import pandas as pd
# import os

# # Load CSV file
# csv_file = "priority.csv"  # Change to your CSV file name
# df = pd.read_csv(csv_file)

# # Define class names
# class_names = ["Critical", "High", "Low", "Medium"]  # Update with your classes
# class_dict = {name: i for i, name in enumerate(class_names)}

# # Create labels folder
# labels_dir = "./data/labels/"
# os.makedirs(labels_dir, exist_ok=True)

# # Convert to YOLO format
# for _, row in df.iterrows():
#     image_name = os.path.splitext(row["image_path"].replace("./data/images/", ""))[0]
#     class_id = class_dict.get(row["priority"])

    
#     # YOLO format: <class_id> <x_center> <y_center> <width> <height>
#     yolo_format = f"{class_id} {row['x_center']} {row['y_center']} {row['width']} {row['height']}\n"
    
#     # Save label file
#     with open(f"{labels_dir}{image_name}.txt", "a") as f:
#         f.write(yolo_format)

# print("✅ CSV converted to YOLO format!")

"""

making the csv to convert to the csv of the yolo format

"""
# import cv2
# import pandas as pd

# def process_csv_for_yolo(input_csv, output_csv):
#     df = pd.read_csv(input_csv)

#     # Check if required columns exist
#     if "Media Attachments" not in df.columns or "Severity Level" not in df.columns:
#         print("❌ CSV file must contain 'image_path' and 'type_of_incident' columns.")
#         return
    
#     updated_data = []

#     for _, row in df.iterrows():
#         image_path = row["Media Attachments"]
#         incident_type = row["Priority"]

#         # Read the image
#         try:
#             image = cv2.imread(image_path)
#             if image is None:
#                 print(f"⚠️ Warning: Unable to read {image_path}. Skipping...")
#                 continue

#             height, width, _ = image.shape

#             # Calculate YOLO format values
#             x_center = 0.5  # Assuming object is centered
#             y_center = 0.5
#             norm_width = width / width  # 1 (whole image)
#             norm_height = height / height  # 1 (whole image)

#             # Ensure values stay in range [0,1]
#             x_center = min(max(x_center, 0), 1)
#             y_center = min(max(y_center, 0), 1)
#             norm_width = min(max(norm_width, 0), 1)
#             norm_height = min(max(norm_height, 0), 1)

#             # Append updated row
#             updated_data.append({
#                 "image_path": image_path,
#                 "priority": incident_type,
#                 "x_center": round(x_center, 4),
#                 "y_center": round(y_center, 4),
#                 "width": round(norm_width, 4),
#                 "height": round(norm_height, 4)
#             })
        
#         except Exception as e:
#             print(f"Error processing {image_path}: {e}")

#     # Convert back to DataFrame and save as a new CSV file
#     df_updated = pd.DataFrame(updated_data)
#     df_updated.to_csv(output_csv, index=False)
#     print(f"✅ New CSV file '{output_csv}' created successfully!")

# # Example usage
# input_csv = "./data/alertX.csv"  # Replace with your input CSV
# output_csv = "priority.csv"  # Output CSV file
# process_csv_for_yolo(input_csv, output_csv)


"""

# making the yaml file

# """
# import pandas as pd
# import yaml

# # Paths to CSV files
# csv_files = ["priority.csv"]

# # Extract unique class names
# class_names = set()
# for csv_file in csv_files:
#     df = pd.read_csv(csv_file)
#     class_names.update(df["priority"].unique())  # Collect unique labels

# # Convert class names to a sorted list
# class_names = sorted(class_names)

# # Define YAML structure
# data_yaml = {
#     "train": "data/images/train/",
#     "val": "data/images/val/",
#     "test": "data/images/test/",  # Optional
#     "nc": len(class_names),  # Number of classes
#     "names": class_names  # Class names
# }

# # Save YAML file
# yaml_path = "data.yaml"
# with open(yaml_path, "w") as file:
#     yaml.dump(data_yaml, file, default_flow_style=False)

# print(f"✅ data.yaml file created successfully!")




"""

check the scores and accuracy 

"""

import torch
from yolov5 import val

# # List of YOLO model weights
# MODEL_PATHS = [
#     "models/department_model.pt",  # Replace with your trained model paths
#     "models/severity_model.pt",
#     "models/priority_model.pt",
#     "models/type_model.pt"
# ]

# # List of dataset YAML files
# DATASET_CONFIGS = [
#     "yaml/department.yaml",  # Replace with your dataset config files
#     "yaml/priority.yaml"
#     "yaml/severity.yaml"
#     "yaml/type.yaml"
# ]

# def evaluate_models():
#     for model in MODEL_PATHS:
#         for dataset in DATASET_CONFIGS:
#             print(f"\nEvaluating Model: {model} on Dataset: {dataset}")

#             # Run YOLO validation
#             results = val.run(
#                 data=dataset,
#                 weights=model,
#                 imgsz=640,
#                 conf_thres=0.25,
#                 iou_thres=0.5
#             )

#             # Extract key metrics
#             mAP_50 = results['metrics/mAP_0.5']
#             mAP_50_95 = results['metrics/mAP_0.5:0.95']
#             precision = results['metrics/precision']
#             recall = results['metrics/recall']

#             print(f"mAP@0.5: {mAP_50:.4f}")
#             print(f"mAP@0.5:0.95: {mAP_50_95:.4f}")
#             print(f"Precision: {precision:.4f}")
#             print(f"Recall: {recall:.4f}")

# if __name__ == "__main__":
#     evaluate_models()

import torch
from yolov5 import val

# Path to your trained model and dataset config file
MODEL_PATH = "models/department_model.pt"  # Change to your trained model path
DATASET_CONFIG = "yaml/department.yaml"  # Change to your dataset config file

def evaluate_yolo():
    # Run YOLO validation
    results = val.run(data=DATASET_CONFIG, weights=MODEL_PATH, imgsz=640, conf_thres=0.25, iou_thres=0.5)
    
    print("Results:", results)
    print("Type of results:", type(results))

    # Extract mAP values correctly
    mAP_50 = results[0][0]   # First value of first tuple
    mAP_50_95 = results[0][1]
    precision = results[0][2]
    recall = results[0][3]

    print(f"mAP@0.5: {mAP_50:.4f}")
    print(f"mAP@0.5:0.95: {mAP_50_95:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall: {recall:.4f}")

if __name__ == "__main__":
    evaluate_yolo()
