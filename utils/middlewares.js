//MULTER
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `public/images/`)
    },
    filename: function (req, file, cb) {
        console.log('hello multer')
        cb(null, `${file.originalname}-${Date.now()}.${file.mimetype === 'image/jpeg' ? 'jpg' : 'png'}`)
    }
})
const upload = multer({ storage: storage })

const fileUploads = upload.fields([
    { name: 'profileImg', maxCount: 1 },
    { name: 'assetsSrc', maxCount: 1 },
    { name: 'pictures', maxCount: 10 },
])

//COOKIES
async function validateCookie(req, res, next) {
    const cookies = req.cookies;
    const currentUserId = req.params.userId || req.query.userId || req.body.userId;
    if ('fsCookie' in cookies) {
        console.log(cookies.fsCookie)
        if (cookies.fsCookie == currentUserId) next();
        else {
            res.status(403).send({ msg: 'Not logged in' })
        }
    } else {
        res.status(403).send({ msg: 'Not logged in' })
    }
}


module.exports = { fileUploads, validateCookie }