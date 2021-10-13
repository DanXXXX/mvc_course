const { validationResult } = require("express-validator");
const User = require('../models/User');

module.exports = {
     // Affiche la page d'inscription
    getSignupPage: (req, res) => {
        res.render('signup');
    },
    // Affiche la page de connexion
    getSigninPage: (req, res) => {
        res.render('signin');
    },
    // Inscrit un nouvel utilisateur et l'ajoute en base de données
    signupUser: (req, res) => {
        const errors = validationResult(req);
        if (errors.isEmpty() === false) {
            res.status(500).json({errors: errors.array()});
            return;
        }
        const user = new User(req.body);
        user.save()
        .then(response => {
            res.render('signup', {user: response.toObject(), title: 'Liste de nos supers utilisateurs'});
        }).catch(error => {
            console.error(error);
            res.status(500).json({error});
        })
    },
    // Connecte un utilisateur
    signinUser: (req, res) => {
        // Récupération d'un utilisateur par son username
        User.findOne({username: req.body.username})
        .then((user) => {
            // Condition de vérification du mot de passe
            if (user.password === req.body.password) {
                // Définition de la session
                req.session.loggedIn = true;
                req.session.user = user;

                const expiresAt = Date.now() + (1000 * 60 * 60 * 24 * 30); // Date d'expiration du cookie
                // Ajout du cookie de connection
                res.setHeader('Set-Cookie', 'loggedIn=true; path=/; Expires=' + new Date(expiresAt).toUTCString());
                return res.redirect('/');
            }
            return res.status(500).json(new Error('Wrong password').message);
        }).catch(error => {
            console.error(error);
            res.status(404).json({error: error});
        });
    },
    // Déconnecte l'utilisateur
    logoutUser: (req, res) => {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({error});
            }
            res.clearCookie('loggedIn');
            res.redirect('/users/signin');
        })
    },
    // Affiche la page d'un utilisateur
    getUserPage: (req, res) => {
        const username = req.params.username;
        const user = users.find(user => user.username === username);
        res.render('user', {user});
    }
}