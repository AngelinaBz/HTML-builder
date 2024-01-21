const fs = require('fs'); 
const path = require("path");

const folderPath = path.join(__dirname, "secret-folder");

fs.readdir(folderPath,
    { withFileTypes: true },
    (err, files) => {
        if (err) {
            console.error(err);
        } else {
            files.forEach((file) => { 
                if (file.isFile()) {
                    const fileName = path.parse(file.name).name;
                    const fileExtension = path.extname(file.name).slice(1);
                    const filePath = path.join(folderPath, file.name);
                    fs.stat(filePath, (err, stats) => {
                        if (err) {
                            console.error(err);
                        }
                
                        const fileSize = stats.size;
                
                        console.log(`${fileName} - ${fileExtension} - ${fileSize} bytes`);
                    });
                }
            });
        };
    });