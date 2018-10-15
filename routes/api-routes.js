const app = require('express').Router();
const cheerio = require('cheerio');
const request = require('request');

const db = require('../models');

app.get('/scrape', function(req, res) {
    request('https://madamenoire.com', function(err, response, html) {
        const $ = cheerio.load(html);

        const results = [];

        $('h2').each(function(i, element) {
            const link = $(this)
                .find('a')
                .attr('href');
            const title = $(this).text();

            const result = { link: link, title: title };

            if (link && title) {
                results.push(result);
            }
        });

        db.Story.insertMany(results).then(function() {
            res.redirect('/');
        });
    });
});

app.get('/drop', function(req, res) {
    db.Story.deleteMany({}, (err) => {
        if (err) return console.log(err);
        db.Comment.deleteMany({}, (err) => {
            if (err) return console.log(err);
            res.redirect('/');
        });
    });
});

app.get('/stories', function(req, res) {
    db.Story.find({}, function(err, stories) {
        if (err) return console.log(err);

        res.json(stories);
    });
});

app.post('/stories/:id', function(req, res) {
    const comment = new db.Comment(req.body);

    comment.save(function(err, doc) {
        if (err) return console.log(err);

        db.Story.findOneAndUpdate({ _id: req.params.id }, { $push: { comments: doc._id } }).exec(function(err, doc) {
            if (err) return console.log(err);

            res.redirect(req.path);
        });
    });
});

module.exports = app;
