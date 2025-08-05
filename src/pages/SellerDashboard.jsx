import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";

export default function SellerDashboard() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);

  // 🔹 Check if seller is logged in
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/seller-login");
      } else {
        setCurrentUser(user);
        // Fetch this seller's uploaded photos
        const q = query(
          collection(db, "photos"),
          where("sellerId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const unsubscribePhotos = onSnapshot(q, (snapshot) => {
          setPhotos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribePhotos();
      }
    });
    return () => unsubscribeAuth();
  }, [navigate]);

  // 🔹 Upload Photo to Firebase Storage + Firestore
  const handleUpload = async () => {
    if (!file || !title || !tags || !price) {
      alert("Please fill all fields and select a file");
      return;
    }

    try {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `photos/${currentUser.uid}_${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Save photo details to Firestore
      await addDoc(collection(db, "photos"), {
        sellerId: currentUser.uid,
        title,
        tags: tags.split(","),
        price,
        imgUrl: downloadURL,
        createdAt: new Date(),
      });

      // Clear form
      setTitle("");
      setTags("");
      setPrice("");
      setFile(null);
      alert("Photo uploaded successfully!");
    } catch (error) {
      console.error("Upload error", error);
      alert("Upload failed. Please try again.");
    }
  };

  // 🔹 Seller Logout
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Seller Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Upload a Photo</h2>
        <input
          type="text"
          placeholder="Photo Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border rounded w-full mb-2"
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="p-2 border rounded w-full mb-2"
        />
        <input
          type="number"
          placeholder="Price (₹)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="p-2 border rounded w-full mb-2"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-2"
        />
        <button
          onClick={handleUpload}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Upload Photo
        </button>
      </div>

      {/* Uploaded Photos */}
      <h2 className="text-xl font-bold mb-2">Your Uploaded Photos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <div key={photo.id} className="bg-white rounded shadow p-3">
            <img src={photo.imgUrl} alt={photo.title} className="rounded mb-2" />
            <h2 className="font-bold">{photo.title}</h2>
            <p className="text-gray-500 text-sm">
              Tags: {photo.tags.join(", ")}
            </p>
            <p className="text-green-600 font-semibold">₹{photo.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
