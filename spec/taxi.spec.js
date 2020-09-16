const express = require("express");
const taxiRoutes = require('../src/api/v1/routes/taxi-routes');
const request = require("supertest");
var uniqid = require('uniqid');
const { generateRandomPoint } = require('../src/api/lib/utils');
const bodyParser = require("body-parser");

// fake express server
const app = express();
app.use(bodyParser.json());

// load taxi routes for testing
app.use("/api/v1/taxi", taxiRoutes);


describe("taxi get services", () => {
    beforeAll(async () => {
        let sampleLocation = generateRandomPoint();
        const sampleTaxi = {
            "driver" : {
                "name" : uniqid.time()
            },
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
    });
    it("GET /api/v1/taxi - success", async () => {
        const { body, statusCode } = await request(app)
                            .get("/api/v1/taxi")
                            .set('Accept', 'application/json');
        expect(statusCode).toEqual(200);
        // expect(body.length).toBeGreaterThan(0);
    });
});

describe("taxi add services", () => {
    // beforeEach(() => console.log('Before each inner'));
    it("POST /api/v1/taxi - with empty object", async () => {
        const res = await request(app)
                            .post("/api/v1/taxi")
                            .set('Content-Type', 'application/json')
                            .set('Accept', 'application/json')
                            .send({});
        expect(res.statusCode).toEqual(500);
    });

    it("POST /api/v1/taxi - with sample object", async () => {
        let sampleLocation = generateRandomPoint();
        const sampleTaxi = {
            "driver" : {
                "name" : uniqid.time()
            },
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
        expect(statusCode).toEqual(200);
        expect(body.driver.name).toEqual(sampleTaxi.driver.name);
        expect(body.car.car_number).toEqual(sampleTaxi.car.car_number);
        expect(body.taxi_type).toEqual("NORMAL");
        expect(body.location).toEqual(sampleLocation);
    });
});

describe("Update taxi-type services", () => {
    let taxi;
    beforeAll(async () => {
        const { body, statusCode } = await request(app)
                            .get("/api/v1/taxi")
                            .set('Accept', 'application/json');
        taxi = body[body.length - 1];
    });
    it("update /api/v1/taxi/:id", async () => {
        const { body, statusCode } = await request(app)
                            .put("/api/v1/taxi/"+taxi.id)
                            .send({"taxi_type": "PINK"})
                            .set('Accept', 'application/json');
        expect(statusCode).toEqual(200);
        expect(body.taxi_type).toEqual("PINK");
    });
});

describe("taxi get services by type", () => {
    it("GET /api/v1/taxi - all normal taxis", async () => {
        const { body, statusCode } = await request(app)
                            .get("/api/v1/taxi?taxi_type=NORMAL")
                            .set('Accept', 'application/json');
        expect(statusCode).toEqual(200);
        expect(body.length).toBeGreaterThan(0);
    });
    it("GET /api/v1/taxi - all pink taxis", async () => {
        const { body, statusCode } = await request(app)
                            .get("/api/v1/taxi?taxi_type=PINK")
                            .set('Accept', 'application/json');
        expect(statusCode).toEqual(200);
        expect(body.length).toBeGreaterThan(0);
    });
});

describe("delete taxi", () => {
    let taxi;
    beforeAll(async () => {
        const { body, statusCode } = await request(app)
                            .get("/api/v1/taxi")
                            .set('Accept', 'application/json');
        taxi = body[body.length - 1];
    });
    it("get /api/v1/taxi/:id", async () => {
        const { body, statusCode } = await request(app)
                            .delete("/api/v1/taxi/"+taxi.id)
                            .set('Accept', 'application/json');
        expect(statusCode).toEqual(200);
        expect(body.status).toEqual("SUCCESS");
        expect(body.payload.status).toEqual("DELETED");

    });
});