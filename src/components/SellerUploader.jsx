import { useState } from "react";
import { storage } from "../firebase";
import { getAuth } from "firebase/auth";
import { getFirestore, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function SellerUploader() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("street");
  const [tags, setTags] = useState("");

  const db = getFirestore();
  const auth = getAuth();

  const onUpload = async () => {
    if (!file) return alert("Choose a file");
    const user = auth.currentUser;
    if (!user) return alert("Login required");

    const storagePath = `sellers/${user.uid}/${Date.now()}_${file.name}`;
    const fileRef = ref(storage, storagePath);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);

    await addDoc(collection(db, "photos"), {
      title,
      price: Number(price),
      category,
      tags: tags.split(",").map(t => t.trim().toLowerCase()).filter(Boolean),
      downloadURL,
      storagePath,
      uploaderUid: user.uid,
      createdAt: serverTimestamp(),
      status: "active",
    });

    setFile(null); setTitle(""); setPrice(""); setCategory("street"); setTags("");
    alert("Uploaded!");
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-3">
      <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
      <input className="border p-2 w-full" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Price" type="number" value={price} onChange={e=>setPrice(e.target.value)} />
      <select className="border p-2 w-full" value={category} onChange={e=>setCategory(e.target.value)}>
        <option value="street">Street</option>
        <option value="portrait">Portrait</option>
        <option value="nature">Nature</option>
        <option value="abstract">Abstract</option>
      </select>
      <input className="border p-2 w-full" placeholder="Tags (comma separated)" value={tags} onChange={e=>setTags(e.target.value)} />
      <button className="bg-black text-white px-4 py-2 rounded" onClick={onUpload}>Upload</button>
    </div>
  );
}
