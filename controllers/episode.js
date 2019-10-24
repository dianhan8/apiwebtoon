const Episode = require('../models').episode
const Webtoon = require('../models').webtoon
const Detail = require('../models').detail

const multer = require('multer');
const path = require('path');

//Get All Episode By Webtoon Id
exports.show = (req, res) => {
    const webtoon_id = req.params.webtoonid
    Episode.findAll({
        where: { webtoon_id },
        include: [{
            model: Webtoon,
            as: "Webtoon"
        }]
    })
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            res.send({
                error: true,
                message: "Error Cannot Find",
                err
            })
        })
}

//Get All Episode By Webtoon Id For Screen Create My Webtoon
exports.showEpisodeById = (req, res) => {
    const webtoon_id = req.params.webtoonid
    Episode.findAll({
        where: { webtoon_id }
    })
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            res.send({
                error: true,
                message: "Error Can't Find",
                err
            })
        })
}

// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + req.user.userId + '-' + Date.now() + path.extname(file.originalname));
    }
})

// Init Upload
const uploadEpisode = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('cover');
// Init Upload
const uploadDetailEpisode = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).array('image');

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}
//Create Episode By Webtoon
exports.storeEpisode = (req, res) => {
    uploadEpisode(req, res, (err) => {
        if (err) {
            res.send({
                msg: err
            });
        } else {
            if (req.file == undefined) {
                res.send({
                    msg: 'Error: No File Selected!'
                });
            } else {
                res.send({
                    msg: 'File Uploaded!',
                    dest: req.file.destination,
                })
                Episode.create({
                    title: req.body.title,
                    cover: req.file.path,
                    webtoon_id: req.body.webtoon_id,
                    createdAt: new Date(),
                    updatedAt: new Date()
                })
                    .then(function (result) {
                        res.send(result)
                        const id = result.id
                        uploadDetailEpisode(req, res, (err) => {
                            if (err) {
                                res.send({
                                    msg: err
                                });
                            } else {
                                if (req.file == undefined) {
                                    res.send({
                                        msg: 'Error: No File Selected!'
                                    });
                                } else {
                                    res.send({
                                        msg: 'File Uploaded!',
                                        dest: req.file.destination,
                                    })
                                    Detail.bulkCreate(req.body.detail)
                                        .then(function (rest) {
                                            res.send(rest)
                                        })
                                        .catch(function (err) {
                                            res.send(err)
                                        })
                                }
                            }
                        })
                    })
                    .catch(function (err) {
                        res.send({
                            error: true,
                            message: "Can't Create Webtoon",
                            err
                        })
                    })
            }
        }
    })
}

//Update Episode by Id
exports.updateByEpisode = (req, res) => {
    const id = req.params.episodeid
    const body = req.body
    Episode.update({
        title: body.title,
        cover: body.cover,
        updatedAt: new Date()
    },
        {
            where: { id }
        })
        .then(function (result) {
            res.send({
                ...body,
                result
            })
        })
        .catch(function (err) {
            res.send({
                error: true,
                message: "can't update episode",
                err
            })
        })
}

//Delete Episode
exports.DeleteEpisode = (req, res) => {
    const id = req.params.episodeid
    Episode.destroy({
        where: { id }
    })
        .then(function (result) {
            res.send({
                message: `Episode ${id} Has been deleted`,
                result
            })
        })
        .catch(function (err) {
            res.send({
                error: true,
                message: "Can't Update",
                err
            })
        })
}
