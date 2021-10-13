// Middleware de vérification de l'authentification de l'utilisateur
module.exports = (req, res, next) => {
    if (!req.session.loggedIn) {
        return res.redirect('/users/signin');
    }
    next();
}