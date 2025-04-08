import { v2 as cloudinary } from "cloudinary";
import Report from "../models/Report.js";
import axios from "axios";
import FormData from "form-data";


const addReport = async (req, res) => {
  const { description, location, locationName, userId } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "No image file uploaded" });
  }


  try {
    // Upload image to Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) {
            console.error("Error uploading image to Cloudinary:", error);
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      );
      uploadStream.end(req.file.buffer);
    });

    const imageUrl = await uploadPromise;

    // Prepare the image file to send to Flask API
    const form = new FormData();
    form.append("image", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // Call Flask API for prediction
    const mlResponse = await axios.post("http://localhost:6000/predict", form, {
      headers: { ...form.getHeaders() },
    });

    console.log("ML Response:", mlResponse.data);

    const predictedType = mlResponse.data.type;
    const predictedSeverity = mlResponse.data.severity;
    const predictedPriority = mlResponse.data.priority;
    const predictedDepartment = mlResponse.data.department;

    // Save report with predicted type and image URL
    const newReport = new Report({
      type: predictedType,
      description,
      location,
      imageUrl,
      severity: predictedSeverity,
      priority: predictedPriority,
      department: predictedDepartment,
      locationName,
      userId,
    });

    await newReport.save();
    const { status, severity } = newReport;

    const notificationData = {
      title: "New Report",
      body: `${newReport.type} at ${newReport.locationName} is now ${status}.`,
      reportId: newReport._id,
      status,
      severity,
    };

    console.log("Emitting notification:", notificationData);
    console.log(userId)


    // Emit notification
    req.app.get("io").emit("notification", notificationData);

    res.status(201).json({ message: "Report saved successfully" });
    console.log("Report saved");
  } catch (error) {
    console.error("Error processing report:", error);
    res.status(500).json({ error: "Error processing report" });
  }
};


const getReport = async (req, res) => {
  const reports = await Report.find();
  res.status(200).json(reports);
};


const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status field is required" });
    }

    const updatedReport = await Report.findByIdAndUpdate(
      id,
      { status }, // Only updating the status field
      { new: true }
    );

    
    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found" });
    }


    
    const notificationData = {
      title: "Report Update",
      body: `${updatedReport.type} \nLocation: ${updatedReport.locationName} \nSataus:${status}.`,
      reportId: updatedReport._id,
      status,
      severity: `${updateReport.severity}`
    };


    console.log("Emitting notification:", notificationData); // Debugging log

    // Emit notification
    req.app.get("io").emit("notification", notificationData);
    res.json({ message: "Status updated successfully", updatedReport });
  } catch (error) {
    res.status(500).json({ error: "Error updating status" });
  }
};

const deleteReport = async (req, res) => {
  try {
    const { id } = req.params; // Get the report ID from the request params

    const deletedReport = await Report.findByIdAndDelete(id);

    if (!deletedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const fetchReportById = async (req, res) => {
  try {
    const { userId } = req.params;
    const fetchReport = await Report.find(userId)

    if (!fetchReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json({ fetchReport });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export { fetchReportById, addReport, getReport, updateReport,deleteReport };