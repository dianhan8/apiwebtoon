const Webtoon = require('../models').webtoon
const Users = require('../models').user
const Op = require('sequelize').Op


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

//Store /Create Webtoons By Users Id
exports.store = (req, res) => {
    const user_id = req.params.id
    const body = req.body
    Webtoon.create({
        title: body.title,
        genre: body.genre,
        cover: body.cover,
        isFavorite: false,
        user_id,
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






