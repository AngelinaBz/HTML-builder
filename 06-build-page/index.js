const fsPromises = require("fs").promises;
const fs = require("fs");
const path = require("path");

const folderPath = path.join(__dirname, "assets");
const copyPath = path.join(__dirname, "project-dist", "assets");
const stylesPath = path.join(__dirname, "styles");
const copyStylesPath = path.join(__dirname, "project-dist", "style.css");
const templatePath = path.join(__dirname, "template.html");
const headerPath = path.join(__dirname, "components", "header.html");
const articlesPath = path.join(__dirname, "components", "articles.html");
const footerPath = path.join(__dirname, "components", "footer.html");
const indexPath = path.join(__dirname, "project-dist", "index.html");


const copyDir = async (folderPath, copyPath) => {
    try {
        const copyExists = await isDir(copyPath);
        
        if (copyExists) {
            await clearDir(copyPath);
        } else {
            await fsPromises.mkdir(copyPath, { recursive: true });
        }
        
        const folder = await fsPromises.readdir(folderPath);
        
        for (const file of folder) {
            const filePath = path.join(folderPath, file);
            const copyFilePath = path.join(copyPath, file);
            
            const stat = await fsPromises.stat(filePath);
            
            if (stat.isDirectory()) {
                await copyDir(filePath, copyFilePath);
            } else {
                await fsPromises.copyFile(filePath, copyFilePath);
            }
        }
        
    } catch (err) {
        console.error("Ошибка");
    }
};

const isDir = async (dir) => {
    try {
        const stat = await fsPromises.stat(dir);
        return stat.isDirectory();
    } catch (error) {
        return false;
    }
};

const clearDir = async (dir) => {
    const files = await fsPromises.readdir(dir);
    
    for (const file of files) {
        const filePath = path.join(dir, file);
        const fileStat = await fsPromises.stat(filePath);
        
        if (fileStat.isDirectory()) {
            await clearDir(filePath);
            await fsPromises.rmdir(filePath);
        } else {
            await fsPromises.unlink(filePath);
        }
    }
};

const createStyles = async () => {
    try {
      const distExists = await isDir(path.join(__dirname, "project-dist"));
      if (!distExists) {
        console.error("Папка project-dist не создана");
        return;
      }
    await fsPromises.writeFile(copyStylesPath, "");
    
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

                fs.appendFile(copyStylesPath, data, "utf8", err => {
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
    } catch (err) {
        console.error(err);
    }
};

copyDir(folderPath, copyPath)
  .then(() => createStyles())
  .catch(err => console.error(err));

fs.readFile(templatePath, "utf8", (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
  
    fs.readFile(headerPath, "utf8", (err, header) => {
        if (err) {
            console.error(err);
            return;
        }
        
        fs.readFile(articlesPath, "utf8", (err, articles) => {
            if (err) {
                console.error(err);
                return;
            }
            
            fs.readFile(footerPath, "utf8", (err, footer) => {
                if (err) {
                    console.error(err);
                    return;
                }
                
                const mainHTML = data.replace("{{header}}", header).replace("{{articles}}", articles).replace("{{footer}}", footer);
                fs.writeFile(indexPath, mainHTML, "utf8", (err) => {
                    
                    if (err) {
                        console.error(err);
                        return;
                    }
                });
            });
        });
    });
});