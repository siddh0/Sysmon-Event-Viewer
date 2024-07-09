import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import LogViewer from "./LogViewer";
import Sidebar from "./Sidebar";  // Adjust the import path as needed

function App() {
  const [logContent, setLogContent] = useState(null);
  const [error, setError] = useState(null);
  const fileTypes = ["JPG", "PNG", "EVTX", "TXT", "XML"];
  const [file, setFile] = useState(null);

  // Function to handle file upload and read content
  const handleFileUpload = async (file) => {
    if (file) {
      if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        // Handle text file directly in the browser
        try {
          const text = await file.text();
          setLogContent({ content: text });
          setError(null); // Clear any previous errors
        } catch (err) {
          setError("Error reading file: " + err.message);
        }
      } else if (file.name.endsWith(".xml")) {
        // Handle XML file by uploading it to the backend
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await fetch("http://localhost:5000/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Error uploading file");
          }

          const result = await response.json();
          if (result.error) {
            throw new Error(result.error);
          }

          // Assuming result.content is a valid JSON string
          const jsonobj = JSON.parse(result.content);
          setLogContent(jsonobj); // Set parsed JSON content, starting from Events
          setError(null); // Clear any previous errors
        } catch (err) {
          setError("Error processing file: " + err.message);
        }
      } else {
        setError("Unsupported file type");
      }
    } else {
      console.log("No file to read.");
    }
  };

  // Function to handle file change
  const handleChange = (file) => {
    setFile(file);
    handleFileUpload(file);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex">
      <Sidebar />
      <div className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Log File Viewer</h1>
        <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
        {error && <p className="text-red-600 my-2">{error}</p>}
        <div className="log-content mt-4">
          <LogViewer logContent={logContent} />
        </div>
      </div>
    </div>
  );
}

export default App;
