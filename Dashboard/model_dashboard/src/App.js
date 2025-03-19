import React, { useState } from "react";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [detections, setDetections] = useState([]);

  const API_URL = "http://localhost:3000/detect"; // Update this with your actual API URL

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setImage(file);
    }
  };

  const handleDetection = async () => {
    if (!image) {
      alert("Please upload an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Detection failed");

      const result = await response.json();
      setDetections(result.detections); // Assuming API returns an array of detections
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container">
      <h1>YOLOv5 Image Detection Dashboard</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {preview && <img src={preview} alt="Uploaded" className="preview" />}
      <button onClick={handleDetection}>Detect Objects</button>

      <div className="detection-results">
        {detections.length > 0 ? (
          detections.map((detection, index) => (
            <p key={index}>
              {detection.class} - Confidence: {detection.confidence.toFixed(2)}
            </p>
          ))
        ) : (
          <p>No detections yet.</p>
        )}
      </div>
    </div>
  );
}

export default App;
