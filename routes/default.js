const fs = require('fs')  
const path = require('path')
const request = require('request')
const axios = require('axios')
const Cameras = require( '../models/camera' )
const Images = require( '../models/image' )
const RSSIs = require( '../models/rssi' )

const home = function(req, res, next) {
      res.send('Hello World!')
}

const dashboard = function(req, res, next) {
    console.log("DASHBOARD");
    res.sendFile(path.join(__dirname + '/../dashboard.html'))
}

const configureCameras = function(req, res, next) {    
    var camera = {
        mode: "configuration",
        iBeaconSent: "false",
        isConfigured: "false",
        distances: []
    }
    Cameras.update({}, camera, function(err, camera) {
        if(err) {
            res.json({
                error : err
            })
        }
    })
    Cameras.get({}, function(err, cameras) {
        if(err) {
            res.json({error: err})
        }

        for(x=0;x<cameras.length;x++) {
            for(y=0;y<cameras.length;y++) {
                if(x != y) {
                    // query parameter "state"
                    //case 1: esp_ble_gap_start_scanning(0);
                    //case 2: esp_ble_gap_stop_scanning();
                    // BLE iBeacon Scan
                    axios.get('http://'+cameras[y].ipv4+'/iBeacon?state=1').then(resp => {
                        console.log(resp.data);
                    });
                }
            }
            const txIPv4 = cameras[x].ipv4;
            for(z=0;z<10;z++) {
                // query parameter "state"
                //case 3: esp_ble_gap_start_advertising(&ble_adv_params);
                //case 4: esp_ble_gap_stop_advertising();
                // BLE iBeacon Advertise
                axios.get('http://'+txIPv4+'/iBeacon?state=3').then(resp => {
                    console.log(resp.data);
                });
                // query parameter "state"
                //case 3: esp_ble_gap_start_advertising(&ble_adv_params);
                //case 4: esp_ble_gap_stop_advertising();
                // BLE iBeacon Advertise
                axios.get('http://'+txIPv4+'/iBeacon?state=4').then(resp => {
                    console.log(resp.data);
                });
            }
            for(y=0;y<cameras.length;y++) {
                if(x != y) {
                    // query parameter "state"
                    //case 1: esp_ble_gap_start_scanning(0);
                    //case 2: esp_ble_gap_stop_scanning();
                    // BLE iBeacon Scan
                    const rxIPv4 = cameras[y].ipv4;
                    axios.get('http://'+rxIPv4+'/iBeacon?state=2').then(resp => {
                        console.log(resp.data);
                        const rssi = {
                            camNameRx: rxIPv4,
                            camNameTx: txIPv4,
                            timeDate: Date.now().toString(),
                            rssi: resp.data
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
                    });
                }
            }
        }
        res.send('Cameras Calibrated!')
    })
}

const takePictures = function(req, res, next) {    
    Cameras.get({}, function(err, cameras) {
        if(err) {
            res.json({error: err})
        }

        for(x=0;x<cameras.length;x++) {
            const camIPv4 = cameras[x].ipv4;
            axios.get('http://'+camIPv4+'/captureJPG').then(resp => {
                console.log(resp.data);
                const url = 'http://'+camIPv4+'/downloadJPG';
                request.head(url, (err, res, body) => {
                    request(url)
                      .pipe(fs.createWriteStream('public/'+camIPv4+'capture'+Date.now().toString()+'.jpg'))
                      .on('close', () => {
                          console.log("success");
                      })
                  })
            });
        }
    });
}

const captureImage = function(req, res, next) {    
    Cameras.get({}, function(err, cameras) {
        if(err) {
            res.json({error: err})
        }
        for(x=0;x<cameras.length;x++) {
            axios.get('http://'+cameras[x].ipv4+'/captureJPG').then(resp => {
                console.log(resp.data);
            })
        }
        res.send('success');
    })
}

const downloadImage = function(req, res, next) {    
    Cameras.get({}, function(err, cameras) {
        if(err) {
            res.json({error: err})
        }
        for(x=0;x<cameras.length;x++) {
            const camIPv4 = cameras[x].ipv4;
            request.head('http://'+camIPv4+'/downloadJPG', (err, res, body) => {
                request('http://'+camIPv4+'/downloadJPG')
                  .pipe(fs.createWriteStream('public/capture.jpg'))
                //   .pipe(fs.createWriteStream('public/'+camIPv4+'capture'+Date.now().toString()+'.jpg'))
                  .on('close', () => {
                      console.log("success");
                  })
              })
        }
        res.send("success");
    })
}

module.exports = function(router) {
    router.get('/', home);
    router.get('/Dashboard', dashboard);
    router.get('/ConfigureCameras', configureCameras);
    router.get('/TakePictures', takePictures);
    router.get('/CaptureImage', captureImage);
    router.get('/DownloadImage', downloadImage);
}