const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'pictures');

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 

    files.forEach(function (file) {
        const ext = path.extname(file).toLowerCase();
        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
            const filePath = path.join(directoryPath, file);
            const newFilePath = path.join(directoryPath, file.replace(ext, '.webp'));
            
            sharp(filePath)
                .webp({ quality: 80 })
                .toFile(newFilePath)
                .then(() => {
                    console.log(`Converted ${file} to WebP format.`);
                    // Optionally delete the old file to clean up space
                    fs.unlinkSync(filePath);
                })
                .catch(err => {
                    console.error(`Error processing ${file}:`, err);
                });
        }
    });
});
