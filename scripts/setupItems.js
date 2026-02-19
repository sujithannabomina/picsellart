// setupItems.js - Run this ONCE to populate your items collection
// Place this file in: C:\Users\devav\Desktop\picsellart\scripts\setupItems.js

import admin from "firebase-admin";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, "../serviceAccountKey.json"), "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "picsellart-619a7.firebasestorage.app",
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

// ✅ Pricing function (same logic as your pricing.js)
function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function getFixedPriceForImage(fileName) {
  const base = 120;
  const max = 199;
  const h = hashString(String(fileName || "").toLowerCase());
  return base + (h % (max - base + 1));
}

// ✅ Create pretty display name from filename
function createDisplayName(fileName) {
  // Remove extension and clean up
  const name = fileName.replace(/\.(jpg|jpeg|png|gif|webp)$/i, "");
  
  // Remove "sample" prefix
  const cleaned = name.replace(/^sample\d*/i, "");
  
  // Convert to title case
  const titleCase = cleaned
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
    .trim();
  
  return titleCase || "Photo";
}

async function setupItemsCollection() {
  console.log("🚀 Starting automated items setup...\n");

  try {
    // ✅ Step 1: Get all files from public/images/ folder
    console.log("📂 Scanning Firebase Storage: public/images/");
    const [files] = await bucket.getFiles({ prefix: "public/images/" });
    
    // Filter only image files
    const imageFiles = files.filter((file) => {
      const name = file.name.toLowerCase();
      return (
        name.endsWith(".jpg") ||
        name.endsWith(".jpeg") ||
        name.endsWith(".png") ||
        name.endsWith(".gif") ||
        name.endsWith(".webp")
      );
    });

    console.log(`✅ Found ${imageFiles.length} images\n`);

    if (imageFiles.length === 0) {
      console.log("❌ No images found in public/images/ folder!");
      return;
    }

    // ✅ Step 2: Create Firestore items for each image
    let successCount = 0;
    let errorCount = 0;

    for (const file of imageFiles) {
      try {
        const storagePath = file.name; // e.g., "public/images/sample38.jpg"
        const fileName = storagePath.split("/").pop(); // e.g., "sample38.jpg"
        
        // ✅ Generate document ID (URL-encoded path to match checkout)
        const itemId = encodeURIComponent(storagePath.replace("public/", "sample-public/")); 
        // e.g., "sample-public%2Fimages%2Fsample38.jpg"
        
        // ✅ Get download URL
        const [signedUrl] = await file.getSignedUrl({
          action: "read",
          expires: "01-01-2500", // Far future expiry
        });
        
        // ✅ Calculate price
        const price = getFixedPriceForImage(fileName);
        
        // ✅ Generate display name
        const displayName = createDisplayName(fileName);
        
        // ✅ Create Firestore document
        await db.collection("items").doc(itemId).set({
          fileName: fileName,
          displayName: displayName,
          storagePath: storagePath,
          price: price, // ← NUMBER type, not string!
          downloadUrl: signedUrl,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log(`✅ ${fileName} → ${displayName} (₹${price})`);
        successCount++;
      } catch (err) {
        console.error(`❌ Failed: ${file.name}`, err.message);
        errorCount++;
      }
    }

    console.log(`\n🎉 Setup complete!`);
    console.log(`   ✅ Success: ${successCount} items`);
    console.log(`   ❌ Failed: ${errorCount} items`);
    
    if (successCount > 0) {
      console.log("\n🎯 Next steps:");
      console.log("   1. Deploy your Firebase Function (if not done yet)");
      console.log("   2. Test a purchase on your website");
      console.log("   3. Check Buyer Dashboard - downloads should work!");
    }
    
  } catch (error) {
    console.error("❌ Setup failed:", error);
  } finally {
    process.exit(0);
  }
}

// ✅ Run the setup
setupItemsCollection();