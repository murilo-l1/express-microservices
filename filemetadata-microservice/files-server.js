const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

// config for multer
const multer = require('multer');
const upload = multer();

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// passando o metodo single como middleware para o post é possível pegar as infos do arquivo passado na request
app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
    //console.log(req.file);
    if(!req.file)
        res.json({error: 'No file uploaded'});

    const size = req.file['size'] + 'bytes';

    res.json({
        name: req.file['originalname'],
        type: req.file['mimetype'],
        size: size
    });

});



const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
