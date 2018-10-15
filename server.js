// Built-in Node modules
const path = require('path');

// Third-party imports
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

// First-part imports
const apiRoutes = require('./routes/api-routes');
const htmlRoutes = require('./routes/html-routes');

// Constants
const PORT = process.env.PORT || 3002;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mnoire';

// Handlebars Setup
const hbs = expressHandlebars.create({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        section: function(name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    },
    partialsDir: path.join(__dirname, 'views', 'partials')
});

// Express Setup
const app = express();

app.engine('hbs', hbs.engine);
app.set('view engine', '.hbs');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(apiRoutes);
app.use(htmlRoutes);

// Mongoose Setup
mongoose.connect(
    MONGODB_URI,
    { useNewUrlParser: true }
);

mongoose.connection.on('error', function(error) {
    console.log('Mongoose Error: ', error);
});

mongoose.connection.once('open', function() {
    console.log('Mongoose connection successful.');
});

// App startup
app.listen(PORT, function() {
    console.log(`Listening on port ${PORT}`);
});
