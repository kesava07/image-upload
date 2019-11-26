const express = require('express');
const postRouter = express.Router();
const PM = require('../Models/post');
const multer = require('multer');


const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null
        }
        cb(error, 'backend/images')
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(" ").join("-");
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + Date.now() + "." + ext);
    }
})

postRouter.get("/", (req, res) => {
    PM.find().then((documents) => {
        res.status(200).send(documents);
    })
});

postRouter.post("/", multer({ storage: storage }).single('image'), (req, res) => {
    const url = req.protocol + '://' + req.get('host');
    const postData = new PM({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename
    });
    postData.save().then(response => {
        res.status(200).json({
            message: "Post added successfully",
            postData: response
        })
    })
});

postRouter.delete('/:id', (req, res) => {
    PM.deleteOne({ _id: req.body.id })
        .then(() => {
            res.status(200).json({
                message: "Post deleted successfully"
            })
        })
})

module.exports = postRouter;