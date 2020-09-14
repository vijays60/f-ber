# f-ber
[usecase-diagram]: https://user-images.githubusercontent.com/714508/92889888-41f0d380-f434-11ea-9138-81b7fc602d99.png "Use-case Diagram"

[uber_classDiagram]: https://user-images.githubusercontent.com/714508/93084590-ea5f9b80-f6b1-11ea-9b41-7321c5c6088d.png "class diagram"

### Problem Stament
---

You are the proprietor of füber, an on call taxi service.
* You have a fleet of cabs at your disposal, and each cab has a location, determined by it’s latitude and longitude.
* A customer can call one of your taxis by providing their location, and you must assign the nearest taxi to the customer.
* Some customers are particular that they only ride around in pink cars, for hipster reasons. You must support this ability.
* When the cab is assigned to the customer, it can no longer pick up any other customers
* If there are no taxis available, you reject the customer's request.
* The customer ends the ride at some location. The cab waits around outside the customer’s house, and is available to be assigned to another customer.

<!-- Notes:

* You can build this in any programming language of your choice
* We expect good unit tests
* Unfortunately, you skipped Geography, and believe the earth is flat. The distance between two points can be calculated by Pythagoras’ theorem.
* We don’t expect a front end for this, but try to build an restful API.

Extra Credit:

* When the customer ends the ride, log the total amount the customer owes
* The price is 1 dogecoin per minute, and 2 dogecoin per kilometer. Pink cars cost an additional 5 dogecoin.
* HTML front end showing me all the cars available
 
Please Note:

* What we care mostly about is OO modeling, readability, and simplicity. 
* Do not spend time tacking on databases, dependency injection, ORMs, authentication,admin modules for setting up data, and the like. 
* We do not even require a UI or a web framework. 
* It does not add anything to the review process and sometimes detracts from it. 
* We're happy to see you store all your data in memory. We will, most likely, not even execute your code; only read your code and see whether it communicates its intent -->

### System features
---
1. General Features
   * Search for cab service
   * Book a cab service
   * Cancel cab service
1. Pre service 
   * Check estimated value
   * Find pink cab nearby
1. Post service
   * View previous rides
   * Pay for the ride
1. Other Possible features to look out
   * Advance booking
   * mark frequent visit places
   * Give Feedback if any for ride

### System workflow
---
1. User Booking cab
   * User's location(lat & long) will be detected and will show all avilable cab's nearby the user location for a programmed radius(˜2km distance from te cab and user)
   * If cabs' available, User will have to provide destinaton location(lat & long) 
   * User then will be show with estimated fare & wait time on te bases of selected source and destination
   * User can select pink cabs if available.
   * User can now confirm the booking.
   * The cab will marked as booked

1. Ride.
   * Once the driver has picked up the passenger / user he can start the trip.
   * after completion of the ride the customer ends trip with the total cost for the ride is paid.
   * the cab is now avilable for next booking

## Usecase diagram

![use-case-diagram][usecase-diagram]

## Class Diagram
![class-diagram][uber_classDiagram]

### System Assumptions
---
* User Authentication and authorization is already done.
* User information is fetched via auth-token present in the HTTP header
* Nearby cab radius is assumed to value ˜2 Km
* User location referenced by latitude and longitude (lat & long) is provided / derived by the frontend application and passed as parameter to the Rest API as one of the input's
* Wait time is calculated based on the distance between 2 points and assuming the city drving limits 30Km/hr (0.5km/min)
* Soft delete implementation used in all teh api service

### API Endpoints
---
| HTTP Method | Endpoint| Summary |
|:-----------:|------------|---|
| GET | /api/v1/taxi | Get all taxi avilable | 
| POST | /api/v1/taxi | register a new taxi |
| PUT | /api/v1/taxi | Update taxi information |
| DELETE | /api/v1/taxi/<:id> | Delete a taxi        |
| | | |
| POST | /api/v1/booking | book a taxi service | 
| PUT | /api/v1/booking | end booking  |
| GET | /api/v1/booking | get all taxi bookings |
| DELETE | /api/v1/booking/<:id> | delete booking |


### System Setup
--- 
  * To Install 
```
npm install
npm start
```

Now in your browser open URL 
http://localhost:3000/

### Test
---
  * To run test

```
npm test
```
