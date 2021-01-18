const util = require('util');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const config = require('config');

const storage = new GridFsStorage({
    url: process.env.MONGODB_URI || config.mongoURI,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    file: (req, file) => {
        const match = ['image/png', 'image/jpeg'];
        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-rednose-${file.originalname}`;
            return filename;
        }

        return {
            bucketName: 'profileImages',
            filename: `${Date.now()}-rednose-${file.originalname}`
        }
    }
});

const uploadImage = multer({storage: storage}).single('profileImage');
const uploadFilesMiddleWare = util.promisify(uploadImage);

module.exports = uploadFilesMiddleWare;