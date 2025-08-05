// src/routes/api/get.js
const express = require('express');
const { Fragment } = require('../../model/fragment'); // adjust if your Fragment class is elsewhere
const { createSuccessResponse } = require('../../response');

const router = express.Router();

/*
 * Get a list of fragments for the current user
 */
// ✅ GET /v1/fragments - Return a list of fragments for the authenticated user
router.get('/fragments', async (req, res) => {
  if (!req.user) {
    console.warn('Unauthenticated request to GET /fragments');
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }

  try {
    const expand = req.query.expand === '1';
    console.info(`GET /fragments for user ${req.user}`);
    const fragments = await Fragment.byUser(req.user, expand);

    res.status(200).json(
      createSuccessResponse({
        fragments,
      })
    );
  } catch (err) {
    console.error('Error in GET /fragments:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /v1/fragments/:id/info
router.get('/fragments/:id/info', async (req, res) => {
  if (!req.user) {
    console.warn('Unauthenticated request to GET /fragments');
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }

  try {
    console.info(`GET /fragments for user ${req.user}`);
    const fragment = await Fragment.byId(req.user, req.params.id);

    if (!fragment) {
      return res.status(404).json({ status: 'error', message: 'Fragment not found' });
    }

    res.status(200).json(
      createSuccessResponse({
        fragment,
      })
    );
  } catch (err) {
    console.error('Error in GET /fragments:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /v1/fragments/:id
router.get('/fragments/:id', async (req, res) => {
  if (!req.user) {
    console.warn('Unauthenticated request to GET /fragments');
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }

  try {
    console.info(`GET /fragments for user ${req.user}`);
    const fragment = await Fragment.byId(req.user, req.params.id);

    if (!fragment) {
      return res.status(404).json({ status: 'error', message: 'Fragment not found' });
    }

    //const data = await fragment.getData();

    res.setHeader('Content-Type', fragment.type);
    res.status(200).json(
      createSuccessResponse({
        fragment,
      })
    );
  } catch (err) {
    console.error('Error in GET /fragments:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
