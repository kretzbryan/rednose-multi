const util = require('util');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');

const storage = new GridFsStorage({
    url: 'mongodb://localhost:27017/circusnetwork',
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    file: (req, file) => {
        const match = ['image/png', 'image/jpeg'];

        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-rednose-${file.originalname}`
        };
    }
});

const uploadImage = multer({storage: storage}).single('profileImage');
const uploadFilesMiddleWare = util.promisify(uploadImage);

module.exports = uploadFilesMiddleWare;