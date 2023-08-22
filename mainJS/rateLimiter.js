const rateLimiter = require("express-rate-limit");
// Here we are limiting the number of requests to the database to 5 every 10 seconds for each IP address
// This is to prevent the database from being overloaded
const databaseAccessLimiter = rateLimiter({
    max: 5,
    windowMS: 5000, // 5 seconds
    message: "You can't make any more requests at the moment. Try again later",
});

const imageLimiter = rateLimiter({
    max: 100,
    windowMS: 5000, // 5 seconds
});

module.exports = {
    databaseAccessLimiter,
    imageLimiter
};