// src/pages/SellerDashboard.jsx
import React, { useState } from 'react';
import { storage, ref } from "../firebase";
import { uploadBytes, getDownloadURL } from "firebase/storage";

const SellerDashboard = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const uploadPhoto = async () => {
    if (!file) return;

    const filename = `seller/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, filename);

    try {
      setStatus("Uploading...");
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setStatus(`Uploaded Successfully! URL: ${url}`);
    } catch (error) {
      setStatus("Upload Failed.");
      console.error("Error uploading:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Seller Dashboard</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mb-4" />
      <button onClick={uploadPhoto} className="bg-green-600 text-white px-4 py-2 rounded">
        Upload
      </button>
      <p className="mt-4">{status}</p>
    </div>
  );
};

export default SellerDashboard;
