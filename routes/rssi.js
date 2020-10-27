const RSSIs = require('../models/rssi')

const createRSSI = function (req, res, next) {
    var rssi = {
        camNameRx: req.body.rx,
        camNameTx: req.body.tx,
        timeDate: Date.now().toString(),
        rssi: req.body.rssi
    };

    RSSIs.create(rssi, function(err, rssi) {
        if(err) {
            res.json({
                error : err
            })
        }
        res.json({
            message : "RSSI created successfully"
        })
    })
}

const getRSSIs = function(req, res, next) {
    RSSIs.get({}, function(err, rssis) {
        if(err) {
            res.json({
                error: err
            })
        }
        res.json({
            rssis: rssis
        })
    })
}

const getRSSI = function(req, res, next) {
    RSSIs.get({name: req.params.name}, function(err, rssis) {
        if(err) {
            res.json({
                error: err
            })
        }
        res.json({
            rssis: rssis
        })
    })
}

const updateRSSI = function(req, res, next) {
    var rssi = {
        name: req.body.name,
        description: req.body.description
    }
    RSSIs.update({_id: req.params.id}, rssi, function(err, rssi) {
        if(err) {
            res.json({
                error : err
            })
        }
        res.json({
            message : "RSSI updated successfully"
        })
    })
}

const removeRSSI = function(req, res, next) {
    RSSIs.delete({_id: req.params.id}, function(err, rssi) {
        if(err) {
            res.json({
                error : err
            })
        }
        res.json({
            message : "RSSI deleted successfully"
        })
    })
}

module.exports = function(router) {
    router.post('/rssi/create', createRSSI);
    router.get('/rssi/get', getRSSIs);
    router.get('/rssi/get/:name', getRSSI);
    router.put('/rssi/update/:id', updateRSSI);
    router.delete('/rssi/remove/:id', removeRSSI);
}