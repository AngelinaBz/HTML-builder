const fs = require("fs");
const path = require("path");
const stream = fs.createReadStream(path.join(__dirname, "text.txt"), "utf-8");

stream.on("data", (chunk) => console.log(chunk.toString()));
stream.on("error", (error) => console.log("Error", error.message));