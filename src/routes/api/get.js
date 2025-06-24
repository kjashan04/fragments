// src/routes/api/get.js
const express = require('express');
const { Fragment } = require('../../model/fragment'); // adjust if your Fragment class is elsewhere
const { createSuccessResponse } = require('../../response');

const router = express.Router();

/**
 * Get a list of fragments for the current user
 */
/*module.exports = (req, res) => {
  res.status(200).json(
    createSuccessResponse({
      status: 'ok',
      fragments: [],
    })
  );
};*/

// GET /v1/fragments/:id/info
router.get('/v1/fragments/:id/info', async (req, res) => {
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
});

module.exports = router;
