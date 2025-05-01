const checkSession = (req,res,next) => {
    if(req.session.admin) {
        next();
    } else {
        res.redirect('/admin/login')
    }
}

const isLogin = (req,res,next) => {
    if(req.session.admin) {
        return res.redirect('/admin/dashboard');
    } else {
        next()
    }
}

const validateSearch = (req,res,next) => {
    if(!req.query.query || req.query.query.length<2) {
        return res.status(400).send('search query must be atleast 2 characters.');
    }
    next();
}

module.exports = {checkSession, isLogin, validateSearch}