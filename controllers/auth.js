const jwt = require('jsonwebtoken')

const models = require('../models')
const User = models.user

exports.login = (req, res) => {
    const email = req.body.email
    const password = req.body.password

    User.findOne({ where: { email, password } })
        .then(user => {
            if (user) {
                const token = jwt.sign({ userId: user.id }, 'my-secret-token')
                res.send({
                    token
                })
            } else {
                res.send({
                    error: true,
                    message: "Wrong Email or Password!"
                })
            }
        })


}
exports.register = (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password

    User.findAll({
        where: { email }
    })
        .then(function (user) {
            if (user.length > 0) {
                res.send({
                    message: "Can't Register"
                })
            } else if (user.length = 0) {
                User.create({
                    name,
                    email,
                    password,
                    image: null,
                    createdAt: new Date(),
                    updatedAt: new Date()
                })
                    .then(function (result) {
                        res.send({
                            message: "Your Account has created, you can Sign Now"
                        })
                    })
                    .catch(function (err) {
                        res.send({
                            message: "Can't Create Account",
                            err
                        })
                    })
            }
        })
        .catch(function (err) {
            res.send({
                message: "Error Can't Find",
                err
            })
        })
}
