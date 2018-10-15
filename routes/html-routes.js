const app = require('express').Router();
const db = require('../models');

app.get('/', function(req, res) {
    db.Story.find()
        .populate('comments')
        .exec((err, stories) => {
            if (err) return console.log(err);
            res.render('index', { stories: stories });
        });
});

app.get('/stories/:id', function(req, res) {
    db.Story.findOne({ _id: req.params.id })
        .populate('comments')
        .exec(function(err, story) {
            if (err) return console.log(err);

            res.render('story', { story: story });
        });
});

module.exports = app;
