const Favorite = require('../models').favorite
const Webtoon = require('../models').webtoon

//Get Favorite
exports.Favorite = (req, res) => {
    const user_id = req.params.userid
    Favorite.findAll({
        where: { user_id },
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
                message: "Can't Find Favorite",
                err
            })
        })
}

//Add Favorite And Find Favorite
exports.FindAndStore = (req, res) => {
    const user_id = req.body.userid
    const webtoon_id = req.body.webtoonid
    Favorite.findAll({
        where: { user_id, webtoon_id }
    })
        .then(function (result) {
            if (result.length > 0) {
                res.send({
                    message: "This Webtoon Haved"
                })
            } else {
                Favorite.create({
                    user_id,
                    webtoon_id,
                    createdAt: new Date(),
                    updatedAt: new Date()
                })
                    .then(function (favorite) {
                        Webtoon.update({
                            isFavorite: true
                        }, {
                            where: { webtoon_id }
                        })
                            .then(function (result) {
                                res.send({
                                    condition: true,
                                    message: "This Webtoon has be Saved"
                                })
                            })
                    })
                    .catch(function (err) {
                        res.send({
                            message: 'Error Run Create',
                            error: true,
                            err
                        })
                    })
            }
        })
        .catch(function (err) {
            res.send({
                message: "Error Cant Find",
                error: true,
                err
            })

        })
}

//Delete Favorite
exports.deleteFavorite = (req, res) => {
    const user_id = req.params.userid
    const webtoon_id = req.params.webtoonid
    Favorite.delete({
        where: { user_id, webtoon_id }
    })
        .then(function (result) {
            res.send({
                message: "Favorite Has Deleted"
            })
        })
        .catch(function (err) {
            res.send({
                message: "Can't Delete Favorite",
                err
            })
        })
}