const alert = require('alert');
const { request } = require('express');
const express = require('express');
const passport = require('passport');


const router = express.Router();

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (user) req.login(user, loginError => res.redirect('/home'));
        else res.redirect('/home');
    })(req, res, next);
});

router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
