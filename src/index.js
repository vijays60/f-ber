const app = require('./app');

var port = process.env.PORT || 3000;

// start server
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});