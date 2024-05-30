const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 8081;

app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/files', (req, res) => {
    const directoryPath = path.join(__dirname, 'public', 'xml');
    console.log('Directory Path:', directoryPath);
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).send('Error reading directory');
        }
        const xmlFiles = files.filter(file => file.endsWith('.xml'));
        res.json(xmlFiles);
    });
});

app.post('/xml', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let xmlFile = req.files.file2;

    xmlFile.mv(path.join(__dirname, 'public', 'xml', xmlFile.name), (err) => {
        if (err){
            return res.status(500).send(err);
    }
        res.send('File uploaded!');
    });
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
