/* to run -> node createGalleryJSON.js */

const fs = require("fs");
const path = require("path");

const galleryDir = path.join(__dirname, "../gallery");

let result = {};

fs.readdirSync(galleryDir).forEach((folder) => {
  const folderPath = path.join(galleryDir, folder);
  if (fs.statSync(folderPath).isDirectory()) {
    result[folder] = fs
      .readdirSync(folderPath)
      .filter((file) => file.toLowerCase().endsWith(".jpg"))
      .map((file) => "gallery/" + folder + "/" + file);
  }
});

fs.writeFileSync("gallery.json", JSON.stringify(result, null, 2));

console.log("gallery.json created");
