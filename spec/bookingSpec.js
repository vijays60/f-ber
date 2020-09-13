const request = require('request');
const server = require('../src');

const endpoint = 'http://localhost:3000/api/v1/booking';

describe('Booking-service', function () {
    var booking_id = '';

    it('should return 200 response code', function (done) {
        request.get(endpoint, function (error, response) {
            expect(response.statusCode).toEqual(200);
            done();
        });
    });
    it('should fail on POST', function (done) {
        request.post(endpoint, {json: true, body: {}}, function (error, response) {
            expect(response.statusCode).toEqual(500);
            done();
        });
    });

    it('Add new record', function (done) {
        request.post(endpoint, {json: true, body: {
            "taxi": {
                "taxi_type": "NORMAL"
            },
             "customer": {
                 "name": "Bean"
             },
             "source":  {
                 "lat": 12.907908,
                 "long": 77.563640
             },
             "destination":  {
                 "lat": 12.938172,
                 "long": 77.536013
             }
       }}, function (error, response) {
            expect(response.statusCode).toEqual(200);
            let res = response.json();
            booking_id = res.id;
            done();
        });
    });
    it(' get record ' + booking_id + ' ', function(done){
        request.get(
            endpoint+'/'+booking_id, 
            function (error, response) {
                expect(response.statusCode).toEqual(200);
                done();
        });
    });
    it(' complete booking ' + booking_id +" and check for cost ", function(done){
        var PINK = 'PINK';
        request.get(
            endpoint+'/'+booking_id, 
            {json: true, body: {
                "action": "END",
                "payload": {
                    "lat": 12.930390,
                    "long": 77.542703
                }
            }},
            function (error, response) {
                expect(response.statusCode).toEqual(200);
                expect(response.json().cost).toBeGreaterThan(0);
                done();
        });
    });
});