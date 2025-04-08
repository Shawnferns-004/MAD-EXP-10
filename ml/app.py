
from flask import Flask, request, jsonify
from ultralytics import YOLO
import cv2
import numpy as np
from PIL import Image
import io

app = Flask(__name__)

# Load YOLO models
type_model = YOLO("./models/type_model.pt")
department_model = YOLO("./models/department_model.pt")
severity_model = YOLO("./models/severity_model.pt")
priority_model = YOLO("./models/priority_model.pt")

# Function to process the image
def detect_image(image):
    type_results = type_model(image)
    severity_results = severity_model(image)
    department_results = department_model(image)
    priority_results = priority_model(image)

    def get_label(results, model):
        detections = results[0].boxes.cls.tolist()  # Get detected class indices
        if detections: 
            return str(model.names[int(detections[0])])  # Convert index to label
        return "Unknown"

    return {
        "type": get_label(type_results, type_model),
        "severity": get_label(severity_results, severity_model),
        "priority": get_label(priority_results, priority_model),
        "department": get_label(department_results, department_model),
    }


@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        print("No image received")
        return jsonify({'error': 'No image uploaded'}), 400

    image_file = request.files['image']
    print(f"Received file: {image_file.filename}")

    image = Image.open(io.BytesIO(image_file.read()))

    # Run detection
    predictions = detect_image(image)

    print("Predictions:", predictions)  # Debugging
    return jsonify(predictions)


if __name__ == '__main__':
    app.run(port=6000, debug=True)
















    
# from ultralytics import YOLO
# import cv2
# from flask import Flask, request , jsonify
# import numpy as np
# from PIL import Image
# import io 


# # Load trained YOLO model
# type_model = YOLO("./models/type_model.pt")  # Path to the trained model
# department_model = YOLO("./models/department_model.pt")  # Path to the trained model
# severity_model = YOLO("./models/severity_model.pt")  # Path to the trained model
# priority_model = YOLO("./models/priority_model.pt")  # Path to the trained model

# # Set default image path
# image_path = "./test/f.jpg"

# # Function to run inference on an image and store results
# def detect_image(image_path):
#     type_results = type_model(image_path)  # Run inference
#     severity_results = severity_model(image_path)  # Run inference
#     department_results = department_model(image_path)  # Run inference
#     priority_results = priority_model(image_path)  # Run inference

#     type_detections = type_results[0]  # Get first result 
#     severity_detections = severity_results[0]  # Get first result 
#     department_detections = department_results[0]  # Get first result
#     priority_detections = priority_results[0]  # Get first result

    
#     # Extract detection information (bounding boxes, class names, etc.)
#     type_output_data =  [type_model.names[int(cls)] for cls in type_detections.boxes.cls.tolist()]  # Class names
#     department_output_data =  [department_model.names[int(cls)] for cls in department_detections.boxes.cls.tolist()]  # Class names
#     severity_output_data =  [severity_model.names[int(cls)] for cls in severity_detections.boxes.cls.tolist()]  # Class names
#     priority_output_data =  [priority_model.names[int(cls)] for cls in priority_detections.boxes.cls.tolist()]  # Class names
    
    
#     return type_output_data, department_output_data,severity_output_data,priority_output_data # Store results in a variable

# # Run the function and store the output
# detection_results = detect_image(image_path)

# formatted_results = " | ".join([" ".join(category) for category in detection_results])

# print(formatted_results)
















# import cv2
# import numpy as np
# import matplotlib.pyplot as plt
# from ultralytics import YOLO
# from PIL import Image

# # Load trained YOLO models
# models = {
#     "type": YOLO("./models/type_model.pt"),
#     "department": YOLO("./models/department_model.pt"),
#     "severity": YOLO("./models/severity_model.pt"),
#     "priority": YOLO("./models/priority_model.pt"),
# }

# # Set default image path
# image_path = "./test/0.jpg"

# def preprocess_image(image_path):
#     """Load, resize, and normalize the image for YOLO processing."""
#     image = cv2.imread(image_path)  # Load image
#     original = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # Convert BGR to RGB for display

#     resized = cv2.resize(original, (640, 640))  # Resize for YOLO model
#     normalized = resized / 255.0  # Normalize pixel values between 0-1

#     return original, resized, normalized

# def detect_image(image):
#     """Run YOLO models on an image and return results."""
#     results = {key: model(image)[0] for key, model in models.items()}

#     output_data = {
#         key: [model.names[int(cls)] for cls in results[key].boxes.cls.tolist()]
#         for key, model in models.items()
#     }

#     return output_data

# # Preprocess the image
# original_img, resized_img, normalized_img = preprocess_image(image_path)

# # Run detection on the resized image
# detection_results = detect_image(image_path)

# # Display images before & after preprocessing
# fig, ax = plt.subplots(1, 2, figsize=(10, 5))

# ax[0].imshow(original_img)
# ax[0].set_title("Original Image")
# ax[0].axis("off")

# ax[1].imshow(resized_img)
# ax[1].set_title("Preprocessed (Resized) Image")
# ax[1].axis("off")

# plt.show()

# # Print results
# formatted_results = " | ".join([" ".join(detection_results[key]) for key in models.keys()])
# print("Detection Results:", formatted_results)


