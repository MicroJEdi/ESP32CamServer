const Images = require('../models/image')

const createImage = function (req, res, next) {
    var image = {
        camName: req.body.camName,
        timeDate: Date.now().toString(),
        path: "..."
        
    };

    Images.create(image, function(err, image) {
        if(err) {
            res.json({
                error : err
            })
        }
        res.json({
            message : "Image created successfully"
        })
    })
}

const getImages = function(req, res, next) {
    Images.get({}, function(err, images) {
        if(err) {
            res.json({
                error: err
            })
        }
        res.json({
            images: images
        })
    })
}

const getImage = function(req, res, next) {
    Images.get({name: req.params.name}, function(err, images) {
        if(err) {
            res.json({
                error: err
            })
        }
        res.json({
            images: images
        })
    })
}

const updateImage = function(req, res, next) {
    var image = {
        name: req.body.name,
        description: req.body.description
    }
    Images.update({_id: req.params.id}, image, function(err, image) {
        if(err) {
            res.json({
                error : err
            })
        }
        res.json({
            message : "Image updated successfully"
        })
    })
}

const removeImage = function(req, res, next) {
    Images.delete({_id: req.params.id}, function(err, image) {
        if(err) {
            res.json({
                error : err
            })
        }
        res.json({
            message : "Image deleted successfully"
        })
    })
}

module.exports = function(router) {
    router.post('/image/create', createImage);
    router.get('/image/get', getImages);
    router.get('/image/get/:name', getImage);
    router.put('/image/update/:id', updateImage);
    router.delete('/image/remove/:id', removeImage);
}