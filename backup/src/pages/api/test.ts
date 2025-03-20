import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check for test mode headers
    const isTestMode = req.headers['x-test-mode'] === 'true';
    const testUserId = req.headers['x-test-user-id'] as string;

    // Return headers and test mode info
    return res.status(200).json({
      success: true,
      method: req.method,
      path: req.url,
      headers: {
        // Only include relevant headers
        'x-test-mode': req.headers['x-test-mode'],
        'x-test-user-id': req.headers['x-test-user-id'],
        host: req.headers.host,
        'user-agent': req.headers['user-agent'],
      },
      testMode: {
        isTestMode,
        testUserId,
      },
      query: req.query,
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    return res.status(500).json({ error: 'Test endpoint failed' });
  }
}
