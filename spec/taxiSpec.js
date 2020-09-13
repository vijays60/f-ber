const request = require('request');
const server = require('../src');

const endpoint = 'http://localhost:3000/api/v1/taxi';

describe('Taxi-service', function () {
    var taxi_id = '';

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
            "driver" : {
                "name" : "test"
            },
            "car": {
                "car_number": "KA01-MX001"
            },
            "location": {
                "lat" : 12.909331,
                "long": 77.546680
            }
        }}, function (error, response) {
            expect(response.statusCode).toEqual(200);
            let res = response.json();
            taxi_id = res.id;
            done();
        });
    });
    it(' get record ' + taxi_id + ' ', function(done){
        request.get(
            endpoint+'/'+taxi_id, 
            {json: true, body: sampledata}, 
            function (error, response) {
                expect(response.statusCode).toEqual(200);
                done();
        });
    });
    it(' Update Taxi ' + taxi_id + ' to pink type', function(done){
        var PINK = 'PINK';
        request.get(
            endpoint+'/'+taxi_id, 
            {json: true, body: {'taxi_type': PINK}},
            function (error, response) {
                expect(response.statusCode).toEqual(200);
                expect(response.json().taxi_type).toEqual(PINK);
                done();
        });
    });
    it('Delete unknown record ', function(done){
        request.delete(
            endpoint, 
            function (error, response) {
                expect(response.statusCode).toEqual(500);
                done();
        });
    });
    it(' Delete record ' + taxi_id + ' ', function(done){
        request.get(
            endpoint+'/'+taxi_id, 
            {json: true, body: sampledata}, 
            function (error, response) {
                expect(response.statusCode).toEqual(200);
                done();
        });
    });
});