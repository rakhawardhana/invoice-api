const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var db = require("../connection/database.js")

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { 
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  bcrypt
    .hash(password, 12)
    .then(hashedPw => {
      const user = {
        username: username,
        email: email,
        password: hashedPw,
      };
    var sql ="INSERT INTO admin(username, email, password) VALUES (?, ?, ?)"

    db.run(sql, [user.username, user.email, user.password],  (err, result) => {
        console.log(user)
        console.log(result)
        if (err){
            res.status(400).json({"error": err.message})
            console.log(err)
        }

        res.json({
            "message": "success",
            // "data": user,
            // "id" : this.lastID
        })
    });
    }).catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
    const sql =  `select * from admin where email = (?)`
    console.log(req.body)
    db.all(sql, [req.body.email], (err, result) => {
        if(err){
            console.log(err)
            return res.json({message: "login-failed"})
        } else {
            if (result.length === 0) {
                return res.send(401, `password or email are incorrect`)
            }
            else {
                bcrypt.compare(req.body.password, result[0].password)
                .then(val => {
                    if (val === false) return res.send(`password are incorrect`)
                    const { password, ...data } = result[0]
                    const expiresIn = 60 * 60
                    const token = jwt.sign({ ...data, role: 'admin' }, 'somesupersecretsecret', { expiresIn, subject: data.email })
                    res.json({
                      token,
                      exp: expiresIn,
                      ...data
                    })
                })
            }
        }
    })
}