const Webtoon = require('../models').webtoon
const Users = require('../models').user
const Op = require('sequelize').Op

const multer = require('multer');
const path = require('path');


//Method Get /webtoons && /webtoons?title
exports.index = (req, res) => {
    const title = req.query.title
    if (title) {
        Webtoon.findAll({
            where: {
                title: { [Op.like]: `%${title}%` }
            },
            include: [{
                model: Users,
                as: "createdBy"
            }]
        })
            .then(function (result) {
                res.send(result)
            })
            .catch(function (err) {
                res.send(result)
            })
    } else {
        Webtoon.findAll({
            include: [{
                model: Users,
                as: "createdBy"
            }]
        })
            .then(function (result) {
                res.send(result)
            })
            .catch(function (err) {
                res.send({
                    error: true,
                    message: "Error",
                    err
                })
            })
    }
}


//Get All Favorite By Favorite Is True
exports.showFavoriteSearch = (req, res) => {
    const favorite = req.query.is_favorite
    if (favorite) {
        Webtoon.findAll({
            where: { isFavorite: favorite }
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
}

//Get All Webtoon By Users Id
exports.showByUsers = (req, res) => {
    const user_id = req.params.id
    Webtoon.findAll({
        where: { user_id }
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


// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + req.user.userId + '-' + Date.now() + path.extname(file.originalname));
    }
})

// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image');

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

//Store /Create Webtoons By Users Id
exports.store = (req, res) => {
    upload(req, res, (err) => {
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
                Webtoon.create({
                    title: req.body.title,
                    genre: req.body.genre,
                    cover: req.file.path,
                    isFavorite: false,
                    user_id: req.user.userId,
                    createdAt: new Date(),
                    updatedAt: new Date()
                })
                    .then(function (result) {
                        res.send({
                            message: "Your Account Has Created"
                        })
                    })
                    .catch(function (err) {
                        res.send({
                            error: true,
                            message: "Error",
                            err
                        })
                    })
            }
        }
    })
}



// UpdateBy Webtoons
exports.UpdateByWebtoons = (req, res) => {
            const id = req.params.webtoonid
            const body = req.body
            Webtoon.update({
                title: body.title,
                genre: body.genre,
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
                        message: "Error can't update",
                        err
                    })
                })
        }

//Delete Webtoon By Users
exports.DeleteByWebtoons = (req, res) => {
            const id = req.params.webtoonid
            Webtoon.destroy({
                where: { id }
            })
                .then(function (result) {
                    res.send({
                        id,
                        msg: `Webtoons Id ${id} has deleted`
                    })
                })
                .catch(function (err) {
                    res.send({
                        error: true,
                        message: "Can't deleted webtoon",
                        err
                    })
                })
        }






