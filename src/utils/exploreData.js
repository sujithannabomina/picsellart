// src/utils/exploreData.js

// Simple static data for now – each item has an id used in URLs like /view/1
// Images can come from Firebase or any public URL you already use.
// For now, we'll point to your existing sample files in public/images as a fallback.

const TOTAL_IMAGES = 112; // adjust if you have fewer/more

export const explorePhotos = Array.from({ length: TOTAL_IMAGES }, (_, index) => {
  const num = index + 1;
  const filename = `sample${num}.jpg`;

  return {
    id: num,
    title: `sample${num}`,
    filename,
    price: 199,
    // FRONTEND uses this path; if you're using Firebase URLs, you can swap this
    // e.g. url: yourFirebaseList[num]
    url: `/images/${filename}`,
  };
});
