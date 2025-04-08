from ultralytics import YOLO

# Load YOLO model
model = YOLO("yolov8n.pt")  # Use a pretrained model (smallest version)

# Train the model on your dataset
model.train(data="data.yaml", epochs=2, imgsz=640)