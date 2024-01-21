const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, "styles");
const outputPath = path.join(__dirname, "project-dist", "bundle.css");


fs.writeFile(outputPath, "", err => {
    if (err) {
        return;
    }
    
    fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
        if (err) {
            return;
        }       
        
        const filterFiles = files.filter(file => file.isFile() && path.extname(file.name) === ".css").map(file => file.name);
        
        const compilationCSS = (i) => {
            if (i >= filterFiles.length) {
                return;
            }
            
            const fileCSS = filterFiles[i];
            const filePath = path.join(stylesPath, fileCSS);
            
            fs.readFile(filePath, "utf8", (err, data) => {
                if (err) {
                    return;
                }

                fs.appendFile(outputPath, data, "utf8", err => {
                    if (err) {
                        return;
                    }
                    console.log(`Файл ${fileCSS} успешно добавлен`);
                    compilationCSS(i + 1);
                });
            });
        };

        compilationCSS(0);
    });
});