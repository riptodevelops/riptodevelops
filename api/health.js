export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    status: 'operational',
    cluster: 'ap-south-1',
    version: '1.4.2-beta',
    platform: 'vercel',
    timestamp: new Date().toISOString()
  });
}
