const User = require('../models').user

exports.getDataUser = (req, res) => {
    const id = req.params.userId
    User.findOne({
        where: { id }
    })
        .then(function (result) {
            res.send({
                name: result.name,
                image: result.image
            })
        })
        .catch(function (err) {
            res.send({
                error: true,
                message: "Can't Find User",
                err
            })
        })
}

//Update User
exports.updateDataUser = (req, res) => {
    const id = req.params.userId
    const image = req.body.image
    const name = req.body.name
    User.update({
        image,
        name,
        updateAt: new Date()
    },
        {
            where: { id }
        })
        .then(function (result) {
            res.send({
                message: "Succes"
            })
        })
}