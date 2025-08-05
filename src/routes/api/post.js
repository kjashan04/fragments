const express = require('express');
const rawBody = require('body-parser').raw;
const { Fragment } = require('../../model/fragment');

const router = express.Router();

// Supported content types (you can add more as needed)
const supportedTypes = ['text/plain', 'text/markdown', 'application/json'];

router.post(
  '/fragments',
  // Raw body parser middleware for all content types
  rawBody({ type: '*/*' }),

  async (req, res) => {
    console.info('POST /v1/fragments called');

    try {
      // 1. Check authentication
      if (!req.user) {
        console.warn('Unauthenticated request received');
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
      }

      // 2. Validate Content-Type
      const contentTypeHeader = req.get('Content-Type');
      if (!contentTypeHeader) {
        console.warn('Missing Content-Type header');
        return res.status(400).json({ status: 'error', message: 'Missing Content-Type' });
      }

      // Extract base MIME type (remove charset, etc.)
      const contentType = contentTypeHeader.trim();

      // Validate only the MIME part before ';'
      const mimeType = contentTypeHeader.split(';')[0].trim();

      // 3. Handle syntactically invalid content types
      if (!/^[\w.-]+\/[\w.+-]+$/.test(mimeType)) {
        console.warn(`Invalid Content-Type syntax: ${contentTypeHeader}`);
        return res.status(400).json({ status: 'error', message: 'Invalid Content-Type header' });
      }

      // 4. Check supported content types
      if (!supportedTypes.includes(mimeType)) {
        console.warn(`Unsupported Content-Type: ${contentTypeHeader}`);
        return res.status(415).json({ status: 'error', message: 'Unsupported type' });
      }

      // 5. Validate body is a Buffer
      if (!Buffer.isBuffer(req.body)) {
        console.warn('Request body is not a Buffer');
        return res.status(400).json({ status: 'error', message: 'Expected binary body' });
      }

      console.debug('Authenticated user:', req.user);
      console.debug('Content-Type:', contentType);
      console.debug('Request body size:', req.body.length);

      // 6. Create and save the fragment
      const fragment = new Fragment({
        ownerId: req.user,
        type: contentType,
        size: req.body.length,
      });

      await fragment.save();
      console.debug('Fragment saved:', {
        id: fragment.id,
        ownerId: fragment.ownerId,
        type: fragment.type,
        size: fragment.size,
      });

      await fragment.setData(req.body);

      // Re-fetch fragment to get updated metadata
      const savedFragment = await Fragment.byId(req.user, fragment.id);

      // 7. Build Location header using API_URL or request host
      const baseUrl = process.env.API_URL || `${req.protocol}://${req.headers.host}`;
      const location = `${baseUrl}/v1/fragments/${fragment.id}`;
      res.setHeader('Location', location);
      console.debug('Location header set to:', location);
      console.debug('Response fragment metadata:', {
        id: savedFragment.id,
        ownerId: savedFragment.ownerId,
        type: savedFragment.type,
        size: savedFragment.size,
        created: savedFragment.created,
        updated: savedFragment.updated,
      });

      console.info(`Fragment created: ${fragment.id}`);

      // 8. Send success response
      return res.status(201).json({
        status: 'ok',
        fragment: {
          id: savedFragment.id,
          ownerId: savedFragment.ownerId,
          type: savedFragment.type,
          size: savedFragment.size,
          created: savedFragment.created,
          updated: savedFragment.updated,
        },
      });
    } catch (err) {
      console.error('Unexpected error in POST /fragments:', err);
      return res.status(500).json({ status: 'error', message: 'Server error' });
    }
  }
);

module.exports = router;
