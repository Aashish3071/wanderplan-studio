// Super simple endpoint that just returns static data
export default function handler(req, res) {
  // Check for test mode
  const isTestMode = req.headers['x-test-mode'] === 'true';
  const testUserId = req.headers['x-test-user-id'];

  console.log('Basic trips endpoint - Test mode:', isTestMode);
  console.log('Basic trips endpoint - Test user ID:', testUserId);

  // Static trip data
  const sampleTrips = [
    {
      id: 'sample-trip-1',
      title: 'Sample Trip 1',
      description: 'A sample trip for testing',
      destination: 'Sample City',
      startDate: '2023-07-01',
      endDate: '2023-07-07',
      status: 'PLANNING',
      isPublic: true,
      userId: testUserId,
    },
    {
      id: 'sample-trip-2',
      title: 'Sample Trip 2',
      description: 'Another sample trip',
      destination: 'Test Town',
      startDate: '2023-08-10',
      endDate: '2023-08-15',
      status: 'CONFIRMED',
      isPublic: false,
      userId: testUserId,
    },
  ];

  // Return success with static data
  return res.status(200).json({
    success: true,
    data: sampleTrips,
    meta: {
      total: sampleTrips.length,
    },
  });
}
