//const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
//const { createSuccessResponse, createErrorResponse } = require('../../response');
const express = require('express');
const router = express.Router();

// Post /fragments
router.delete('/fragments/:id', async (req, res) => {
  if (!req.user) {
    console.warn('Unauthenticated request to DELETE /fragments/:id');
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }

  try {
    const fragmentId = req.params.id;
    const ownerId = req.user;

    // Find the fragment metadata
    const fragment = await Fragment.byId(ownerId, fragmentId);
    if (!fragment) {
      return res.status(404).json({ status: 'error', message: 'Fragment not found' });
    }

    // Delete fragment data from storage (e.g., S3)
    await fragment.deleteData();

    // Delete fragment metadata from DB/storage
    await fragment.deleteMetadata();

    // Return success response
    res.status(200).json({ status: 'ok' });
  } catch (err) {
    if (err.message === 'Fragment not found') {
      return res.status(404).json({ status: 'error', message: 'Fragment not found' });
    }
    console.error('Error deleting fragment:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
