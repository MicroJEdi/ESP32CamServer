const Cameras = require( '../models/camera' )

const createCamera = function (req, res, next) {
    console.log("CREATE CAMERA");
    var camera = {  
        name: "cam_"+req.body.ipv4,
        mac: req.body.mac,
        ipv4: req.body.ipv4,
        mode: "configure",
        state: "ready",
        iBeaconSent: "false",
        isConfigured: "false",
        distances: []
    };

    Cameras.create(camera, function(err, camera) {
        if(err) {
            res.json({
                error : err
            })
        }
        res.json({
            message : "Camera created successfully"
        })
    })
}

const getCameras = function(req, res, next) {
    Cameras.get({}, function(err, cameras) {
        if(err) {
            res.json({
                error: err
            })
        }
        res.json({
            cameras: cameras
        })
    })
}

const getCamera = function(req, res, next) {
    Cameras.get({name: req.params.name}, function(err, cameras) {
        if(err) {
            res.json({
                error: err
            })
        }
        res.json({
            cameras: cameras
        })
    })
}

const updateCamera = function(req, res, next) {
    var camera = {
        name: req.body.name,
        description: req.body.description
    }
    Cameras.update({_id: req.params.id}, camera, function(err, camera) {
        if(err) {
            res.json({
                error : err
            })
        }
        res.json({
            message : "Camera updated successfully"
        })
    })
}

const removeCamera = function(req, res, next) {
    Cameras.delete({_id: req.params.id}, function(err, camera) {
        if(err) {
            res.json({
                error : err
            })
        }
        res.json({
            message : "Camera deleted successfully"
        })
    })
}

module.exports = function(router) {
    router.post('/camera/create', createCamera);
    router.get('/camera/get', getCameras);
    router.get('/camera/get/:name', getCamera);
    router.put('/camera/update/:id', updateCamera);
    router.delete('/camera/remove/:id', removeCamera);
}