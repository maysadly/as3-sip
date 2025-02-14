function errorHandler(err, req, res, next) {
    console.error(err.stack);
    req.flash('error', err.message || 'Something went wrong!');
    res.status(500).render('error', { error: err });
}

module.exports = errorHandler;