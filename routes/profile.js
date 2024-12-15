var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const originalName = path.parse(file.originalname).name;
    const ext = path.extname(file.originalname);
    cb(null, `${originalName}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(new Error('Bakarrik PNG eta JPG motako fitxategiak onartzen dira.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: fileFilter
});

router.get('/', function (req, res, next) {
  res.redirect('form.html');
});

router.post('/', (req, res, next) => {
  upload.single('avatar')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).send('Errorea: Fitxategiak gehienez 2MB izan behar ditu.');
      }
      return res.status(400).send(`Errorea: ${err.message}`);
    } else if (err) {
      return res.status(400).send(`Errorea: ${err.message}`);
    }
    const userName = req.body.name;
    const fileUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    console.log(req.file);
    console.log(`Zure izena: ${userName}. Fitxategia: ${fileUrl}`);
    res.send('Jasota');
  });
});

module.exports = router;
