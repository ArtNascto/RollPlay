const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3001;

// Check if certificates exist
const keyPath = path.join(__dirname, '..', 'certs', 'localhost.key');
const certPath = path.join(__dirname, '..', 'certs', 'localhost.crt');

if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
  console.error('\n❌ SSL certificates not found!');
  console.error('   Run: npm run generate-certs\n');
  process.exit(1);
}

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
};

app.prepare().then(() => {
  createServer(httpsOptions, async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log('\n🎲 RollPlay - HTTPS Development Server');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`✓ Ready on https://${hostname}:${port}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n⚠️  First time? Trust the certificate:');
      console.log('   Chrome: Click "Advanced" > "Proceed to localhost"');
      console.log('   Firefox: Click "Advanced" > "Accept the Risk"');
      console.log('\n📱 For mobile testing:');
      console.log(`   Use: https://${require('os').networkInterfaces()?.['Wi-Fi']?.[1]?.address || 'YOUR_IP'}:${port}`);
      console.log('\n');
    });
});
