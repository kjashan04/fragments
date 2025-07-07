// src/routes/index.js

// importing functions from response.js
const { createSuccessResponse } = require('../response');

const express = require('express');

// version and author from package.json
const { version, author } = require('../../package.json');

// Create a router that we can use to mount our API
const router = express.Router();

// Our authentication middleware
const { authenticate } = require('../auth');

//const getRoutes = require('./api/get'); // this includes your new /v1/fragments route
//router.use(getRoutes); // this makes /v1/fragments accessible
/**
 * Expose all of our API routes on /v1/* to include an API version.
 * Protect them all with middleware so you have to be authenticated
 * in order to access things.
 */
router.use(`/v1`, authenticate(), require('./api'));

/**
 * Define a simple health check route. If the server is running
 * we'll respond with a 200 OK.  If not, the server isn't healthy.
 */
router.get('/', (req, res) => {
  // Client's shouldn't cache this response (always request it fresh)
  res.setHeader('Cache-Control', 'no-cache');
  // Send a 200 'OK' response
  res.status(200).json(
    createSuccessResponse({
      status: 'ok',
      author,
      githubUrl: 'https://github.com/kjashan04/fragments',
      version,
    })
  );
});

module.exports = router;
