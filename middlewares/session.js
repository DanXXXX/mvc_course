const express = require('express');
const app = express();
const session = require('express-session');

// Middleware de configuration de express-session
app.use(session({
    secret: 'my-super-secret',
    resave: false,
    saveUninitialized: false
}));

module.exports = app;