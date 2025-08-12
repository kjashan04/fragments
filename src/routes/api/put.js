const express = require('express');
const router = express.Router();
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse } = require('../../response');

router.put('/fragments/:id', async (req, res) => {
  if (!req.user) {
    console.warn('Unauthenticated request to PUT /fragments/:id');
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }

  try {
    const ownerId = req.user;
    const fragmentId = req.params.id;
    const contentType = req.headers['content-type'];

    if (!contentType) {
      return res.status(400).json({ status: 'error', message: 'Content-Type header required' });
    }

    // Find existing fragment metadata
    const fragment = await Fragment.byId(ownerId, fragmentId);

    if (!fragment) {
      return res.status(404).json({ status: 'error', message: 'Fragment not found' });
    }

    // Check that the Content-Type matches the original fragment type
    if (contentType !== fragment.type) {
      return res.status(400).json({
        status: 'error',
        message: `Content-Type mismatch. Fragment type is '${fragment.type}'`,
      });
    }

    // Get the new data from the request body (assumes body-parser or similar middleware is used)
    const newData = req.body;

    if (!newData || (typeof newData === 'object' && Object.keys(newData).length === 0)) {
      return res.status(400).json({ status: 'error', message: 'Request body is empty' });
    }

    // Save new data to storage (e.g., S3)
    await fragment.setData(newData);

    // Update metadata (size and updated timestamp)
    fragment.size = Buffer.byteLength(newData, 'utf8'); // or newData.length for Buffer
    fragment.updated = new Date().toISOString();

    await fragment.save(); // method to update metadata in DB or storage

    res.status(200).json(
      createSuccessResponse({
        fragment: {
          id: fragment.id,
          ownerId: fragment.ownerId,
          created: fragment.created,
          updated: fragment.updated,
          type: fragment.type,
          size: fragment.size,
          // add formats if your model supports it
          formats: fragment.formats || [fragment.type],
        },
      })
    );
  } catch (err) {
    if (err.message === 'Fragment not found') {
      return res.status(404).json({ status: 'error', message: 'Fragment not found' });
    }
    console.error('Error in PUT /fragments/:id:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
