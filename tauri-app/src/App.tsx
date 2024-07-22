// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LogViewer from './components/LogViewer';
import Sidebar from './components/Sidebar';
import CybersecurityNews from './components/CybersecurityNews';
import { FileUploader } from "react-drag-drop-files";

function Home({ handleChange, fileTypes, logContent, error }) {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex">
      <Sidebar />
      <div className="flex-grow container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-2 flex items-center justify-between">
          Log File Viewer
          <Link to="/news">
            <button className="bg-blue-500 text-white p-2 rounded text-sm">Cybersecurity News</button>
          </Link>
        </h1>
        <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
        {error && <p className="text-red-600 my-2">{error}</p>}
        <div className="log-content mt-4">
          <LogViewer logContent={logContent} />
        </div>
      </div>
    </div>
  );
}

function App() {
  const [logContent, setLogContent] = useState(null);
  const [error, setError] = useState(null);
  const fileTypes = ["JPG", "PNG", "EVTX", "TXT", "XML"];
  const [file, setFile] = useState(null);

  const handleFileUpload = async (file) => {
    if (file) {
      if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        try {
          const text = await file.text();
          setLogContent({ content: text });
          setError(null);
        } catch (err) {
          setError("Error reading file: " + err.message);
        }
      } else if (file.name.endsWith(".xml")) {
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

          const jsonobj = JSON.parse(result.content);
          setLogContent(jsonobj);
          setError(null);
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

  const handleChange = (file) => {
    setFile(file);
    handleFileUpload(file);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              handleChange={handleChange}
              fileTypes={fileTypes}
              logContent={logContent}
              error={error}
            />
          }
        />
        <Route path="/news" element={<CybersecurityNews />} />
      </Routes>
    </Router>
  );
}

export default App;
