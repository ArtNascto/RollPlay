const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create certs directory if it doesn't exist
const certsDir = path.join(__dirname, '..', 'certs');
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir);
}

const keyPath = path.join(certsDir, 'localhost.key');
const certPath = path.join(certsDir, 'localhost.crt');

// Check if certificates already exist
if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  console.log('✓ SSL certificates already exist in /certs');
  console.log('  - localhost.key');
  console.log('  - localhost.crt');
  process.exit(0);
}

console.log('Generating SSL certificates for localhost...\n');

// Try method 1: mkcert
try {
  execSync('mkcert -version', { stdio: 'ignore' });
  console.log('Using mkcert...');
  execSync(`mkcert -key-file "${keyPath}" -cert-file "${certPath}" localhost 127.0.0.1 ::1`, {
    stdio: 'inherit',
  });
  console.log('\n✓ Certificates generated successfully with mkcert!');
  printSuccess();
  process.exit(0);
} catch (mkcertError) {
  console.log('mkcert not found, trying OpenSSL...');
}

// Try method 2: OpenSSL
try {
  const opensslCmd = `openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj "/CN=localhost" -keyout "${keyPath}" -out "${certPath}" -days 365`;
  execSync(opensslCmd, { stdio: 'inherit' });
  console.log('\n✓ Certificates generated successfully with OpenSSL!');
  printSuccess();
  process.exit(0);
} catch (opensslError) {
  console.log('OpenSSL not found, trying Git Bash...');
}

// Try method 3: Git Bash (comes with Git for Windows)
try {
  const gitBashCmd = `bash -c "openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' -keyout '${keyPath.replace(/\\/g, '/')}' -out '${certPath.replace(/\\/g, '/')}' -days 365"`;
  execSync(gitBashCmd, { stdio: 'inherit' });
  console.log('\n✓ Certificates generated successfully with Git Bash!');
  printSuccess();
  process.exit(0);
} catch (gitBashError) {
  console.log('Git Bash not found, using Node.js selfsigned...');
}

// Method 4: Use Node.js node-forge package (fallback)
try {
  const forge = require('node-forge');
  console.log('Using node-forge...');
  
  // Generate key pair
  const keys = forge.pki.rsa.generateKeyPair(2048);
  
  // Create certificate
  const cert = forge.pki.createCertificate();
  cert.publicKey = keys.publicKey;
  cert.serialNumber = '01';
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
  
  const attrs = [{
    name: 'commonName',
    value: 'localhost'
  }];
  
  cert.setSubject(attrs);
  cert.setIssuer(attrs);
  cert.setExtensions([
    {
      name: 'basicConstraints',
      cA: true
    },
    {
      name: 'keyUsage',
      keyCertSign: true,
      digitalSignature: true,
      nonRepudiation: true,
      keyEncipherment: true,
      dataEncipherment: true
    },
    {
      name: 'subjectAltName',
      altNames: [
        { type: 2, value: 'localhost' },
        { type: 7, ip: '127.0.0.1' }
      ]
    }
  ]);
  
  // Sign certificate
  cert.sign(keys.privateKey, forge.md.sha256.create());
  
  // Convert to PEM format
  const privateKeyPem = forge.pki.privateKeyToPem(keys.privateKey);
  const certPem = forge.pki.certificateToPem(cert);
  
  // Write to files
  fs.writeFileSync(keyPath, privateKeyPem, 'utf8');
  fs.writeFileSync(certPath, certPem, 'utf8');
  
  console.log('\n✓ Certificates generated successfully with node-forge!');
  printSuccess();
  process.exit(0);
} catch (forgeError) {
  console.error('\n❌ All methods failed.');
  console.error('Last error:', forgeError.message);
  console.log('\n💡 Best solution: Install mkcert (easiest and most trusted)');
  console.log('   1. Download from: https://github.com/FiloSottile/mkcert/releases');
  console.log('   2. Extract mkcert.exe to a folder in your PATH');
  console.log('   3. Run: mkcert -install');
  console.log('   4. Run: npm run generate-certs');
  console.log('\n💡 Alternative: Install Git for Windows (includes OpenSSL)');
  console.log('   Download from: https://git-scm.com/download/win');
  process.exit(1);
}

function printSuccess() {
  console.log('\n📁 Certificates saved to:');
  console.log(`  - ${keyPath}`);
  console.log(`  - ${certPath}`);
  console.log('\n⚠️  Note: You may need to trust these certificates in your browser.');
  console.log('   In Chrome: Visit https://localhost:3001, click "Advanced" > "Proceed to localhost"');
  console.log('\n✅ You can now run: npm run dev:https');
}
