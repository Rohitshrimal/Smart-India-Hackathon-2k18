var request = require("request");
var lattitude = 18.520430;
var longitude = 73.856744;

function getData(callback) {
    var options = {
        method: 'GET',
        url: 'https://api.data.gov.in/resource/xxyyzz', // put url
        qs: {
            'api-key': '', // put your key
            format: 'json',
            offset: '0',
            limit: '3000'
        }
    };
    request(options, function(error, response, body) {
        if (error)
            console.log(error);
        else {
            var body = JSON.parse(body)
            callback(body.records);
        }
    });
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function getNearestBloodBanks(lat, long, callback) {
    var nearestBloodBanks = [];

    getData((bloodBankData) => {
        bloodBankData.forEach(function(element) {
            if (element._blood_component_available === 'YES') {
                var distance = getDistanceFromLatLonInKm(lat,
                    long, element._latitude, element._longitude
                );
//                console.log(distance);
                if (distance <= 50) {
                    var dataToAppend = {};
                    dataToAppend.Address = element._address +
                        '\r\n' + element._state
                    dataToAppend.contact = element._contact_no.split();
                    dataToAppend.distance = distance;
                    console.log(dataToAppend, 'hello');
                    nearestBloodBanks.push(dataToAppend);
                }
            }
        });
             callback(sortByKey(nearestBloodBanks,'distance'));
    });

}

getNearestBloodBanks(lattitude, longitude, (data) => {
    console.log(data);
});
