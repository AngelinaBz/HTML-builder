const fs = require("fs").promises;
const path = require("path");

const folderPath = path.join(__dirname, "files");
const copyPath = path.join(__dirname, "files-copy");

const copyDir = async (folderPath, copyPath) => {
    try {
        const copyExists = await isDir(copyPath);
        
        if (copyExists) {
            await clearDir(copyPath);
        } else {
            await fs.mkdir(copyPath, { recursive: true });
        }
        
        const folder = await fs.readdir(folderPath);
        
        for (const file of folder) {
            const filePath = path.join(folderPath, file);
            const copyFilePath = path.join(copyPath, file);
            
            const stat = await fs.stat(filePath);
            
            if (stat.isDirectory()) {
                await copyDir(filePath, copyFilePath);
            } else {
                await fs.copyFile(filePath, copyFilePath);
            }
        }
        
    } catch (err) {
        console.error("Ошибка");
    }
};

const isDir = async (dir) => {
    try {
        const stat = await fs.stat(dir);
        return stat.isDirectory();
    } catch (error) {
        return false;
    }
};

const clearDir = async (dir) => {
    const files = await fs.readdir(dir);
    
    for (const file of files) {
        const filePath = path.join(dir, file);
        const fileStat = await fs.stat(filePath);
        
        if (fileStat.isDirectory()) {
            await clearDir(filePath);
            await fs.rmdir(filePath);
        } else {
            await fs.unlink(filePath);
        }
    }
};

copyDir(folderPath, copyPath);