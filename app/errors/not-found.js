function notFound (req, res){
    // res.status(404).render('./not-found.html');
    res.status(404).send('not-found');
}

module.exports = notFound