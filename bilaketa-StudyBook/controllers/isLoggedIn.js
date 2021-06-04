exports.isLoggedIn= (req, res) => {
    if(!req.isAuthenticated()){
        req.flash('loginMessage', 'Autentikatu behar zera');
        return res.redirect( '/');
    }
}

exports.isNotLoggedIn= (req, res) => {
    if(req.isAuthenticated()){
        req.flash('loginMessage', 'Autentikatuta zaude! Zure kontutik atera nahi badezu, sakatu logout botoia :)');
        return res.redirect( '/user');
    }
}