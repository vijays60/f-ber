const express = require("express");
const bookingRoutes = require('../src/api/v1/routes/booking-routes');
const taxiRoutes = require('../src/api/v1/routes/taxi-routes');
const request = require("supertest");
var uniqid = require('uniqid');
const { generateRandomPoint } = require('../src/api/lib/utils');
const bodyParser = require("body-parser");

// fake express server
const app = express();
app.use(bodyParser.json());

// test booking routes
app.use("/api/v1/taxi", taxiRoutes);
app.use("/api/v1/booking", bookingRoutes);


let user = 'apiuser';

const createtaxi = async function(taxi_type = "NORMAL"){
    let sampleLocation = generateRandomPoint();
        const sampleTaxi = {
            "driver" : {
                "name" : uniqid.time()
            },
            "taxi_type": taxi_type,
            "car": {
                "car_number": "KA01-MI001"
            },
            "location": sampleLocation
        };

        const {body, error, statusCode} = await request(app)
                            .post("/api/v1/taxi")
                            .send(sampleTaxi)
                            .set('Content-Type', 'application/json')
                            .set('Accept', 'application/json');
}

describe("Booking get all user booking", () => {
    it("GET /api/v1/booking - success", async () => {
        const { body, statusCode } = await request(app)
                            .get("/api/v1/booking")
                            .set('USERNAME', user)
                            .set('Accept', 'application/json');
        expect(statusCode).toEqual(200);
        // expect(body.length).toBeGreaterThan(0);
    });
});

describe("Create New booking and end trip", () => {
    
    beforeAll(async () => {
        const { body, statusCode } = await request(app)
                            .get("/api/v1/taxi")
                            .set('Accept', 'application/json');
        if(body.length == 0){
            // make sure the taxi is avilable for booking
            await createtaxi();
            await createtaxi("PINK");
        } else if(body.length > 0){
            let normalTaxi =  body.filter( element => element.taxi_type === "NORMAL");
            let pinkTaxi =  body.filter( element => element.taxi_type === "PINK");
            if (normalTaxi.length == 0){
                await createtaxi();
            }
            if (pinkTaxi.length == 0){
                await createtaxi("PINK");
            }
        }
    });

    const samplebooking = {
        "taxi": {
            "taxi_type": "NORMAL"
        },
         "customer": {
             "name": user
         },
         "source":  generateRandomPoint(),
         "destination":  {
             "lat": 12.938172,
             "long": 77.536013
         }
   }

    it("GET /api/v1/booking - failure", async () => {
        const { body, statusCode } = await request(app)
                            .post("/api/v1/booking")
                            .send({})
                            .set('Accept', 'application/json');
        expect(statusCode).toEqual(500);
    });

    it("book normal taxi /api/v1/booking - success", async () => {
        const { body, statusCode } = await request(app)
                            .post("/api/v1/booking")
                            .send(samplebooking)
                            .set('Accept', 'application/json');
        expect(statusCode).toEqual(200);
        expect(body.status).toEqual("STARTED");
    });

    it("book PINK taxi /api/v1/booking - success", async () => {
        samplebooking.taxi.taxi_type = "PINK"
        const { body, statusCode } = await request(app)
                            .post("/api/v1/booking")
                            .send(samplebooking)
                            .set('Accept', 'application/json');
        expect(statusCode).toEqual(200);
        expect(body.status).toEqual("STARTED");
    });

    it("book PINK taxi /api/v1/booking - not avilable taxi", async () => {
        samplebooking.taxi.taxi_type = "PINK"
        const { body, statusCode } = await request(app)
                            .post("/api/v1/booking")
                            .send(samplebooking)
                            .set('Accept', 'application/json');
        expect(statusCode).toEqual(500);
    });

});