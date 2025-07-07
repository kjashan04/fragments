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
  try {
    const fragments = await Fragment.byUser(req.user);
    res.status(200).json(
      createSuccessResponse({
        fragments,
      })
    );
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /v1/fragments/:id/info
/*router.get('/v1/fragments/:id/info', async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);

    if (!fragment) {
      return res.status(404).json({ status: 'error', message: 'Fragment not found' });
    }

    res.status(200).json(
      createSuccessResponse({
        fragment: {
          id: fragment.id,
          type: fragment.type,
          created: fragment.created,
          updated: fragment.updated,
        },
      })
    );
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});*/

module.exports = router;
