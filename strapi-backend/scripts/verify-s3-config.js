/**
 * Script to verify AWS S3 configuration for Strapi upload provider
 * Run with: node scripts/verify-s3-config.js
 */

require('dotenv').config();

const requiredEnvVars = [
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_REGION',
  'AWS_BUCKET'
];

console.log('🔍 Verifying AWS S3 Configuration...\n');

let allConfigured = true;

// Check environment variables
console.log('📋 Environment Variables:');
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  const isSet = value && value !== 'your_aws_access_key_id' && value !== 'your_aws_secret_access_key';
  
  if (isSet) {
    console.log(`  ✅ ${varName}: ${varName.includes('SECRET') ? '***' : value}`);
  } else {
    console.log(`  ❌ ${varName}: Not configured`);
    allConfigured = false;
  }
});

console.log('\n📦 Package Installation:');
try {
  const packageJson = require('../package.json');
  const hasS3Provider = packageJson.dependencies['@strapi/provider-upload-aws-s3'];
  
  if (hasS3Provider) {
    console.log(`  ✅ @strapi/provider-upload-aws-s3: ${hasS3Provider}`);
  } else {
    console.log('  ❌ @strapi/provider-upload-aws-s3: Not installed');
    allConfigured = false;
  }
} catch (error) {
  console.log('  ❌ Error reading package.json');
  allConfigured = false;
}

console.log('\n⚙️  Plugin Configuration:');
try {
  const fs = require('fs');
  const pluginsPath = require('path').join(__dirname, '../config/plugins.ts');
  const pluginsContent = fs.readFileSync(pluginsPath, 'utf8');
  
  const checks = [
    { name: 'Upload provider configured', pattern: /provider:\s*['"]aws-s3['"]/ },
    { name: 'Access Key ID configured', pattern: /accessKeyId:\s*env\(['"]AWS_ACCESS_KEY_ID['"]\)/ },
    { name: 'Secret Access Key configured', pattern: /secretAccessKey:\s*env\(['"]AWS_SECRET_ACCESS_KEY['"]\)/ },
    { name: 'Region configured', pattern: /region:\s*env\(['"]AWS_REGION['"]\)/ },
    { name: 'Bucket configured', pattern: /Bucket:\s*env\(['"]AWS_BUCKET['"]\)/ },
    { name: 'Public-read ACL configured', pattern: /ACL:\s*['"]public-read['"]/ }
  ];
  
  checks.forEach(check => {
    if (check.pattern.test(pluginsContent)) {
      console.log(`  ✅ ${check.name}`);
    } else {
      console.log(`  ❌ ${check.name}`);
      allConfigured = false;
    }
  });
} catch (error) {
  console.log('  ❌ Error reading plugins.ts:', error.message);
  allConfigured = false;
}

console.log('\n📁 Content Types with Media Fields:');
const contentTypesWithMedia = [
  { name: 'blog-post', field: 'featured_image', path: '../src/api/blog-post/content-types/blog-post/schema.json' },
  { name: 'blog-author', field: 'avatar', path: '../src/api/blog-author/content-types/blog-author/schema.json' }
];

contentTypesWithMedia.forEach(ct => {
  try {
    const schema = require(ct.path);
    const hasMediaField = schema.attributes[ct.field] && schema.attributes[ct.field].type === 'media';
    
    if (hasMediaField) {
      console.log(`  ✅ ${ct.name}.${ct.field}`);
    } else {
      console.log(`  ❌ ${ct.name}.${ct.field}: Not configured`);
    }
  } catch (error) {
    console.log(`  ❌ ${ct.name}: Schema not found`);
  }
});

console.log('\n' + '='.repeat(60));

if (allConfigured) {
  console.log('✅ All S3 upload configuration checks passed!');
  console.log('\n📝 Next Steps:');
  console.log('  1. Ensure your S3 bucket exists and is accessible');
  console.log('  2. Configure bucket CORS policy (see S3_UPLOAD_CONFIGURATION.md)');
  console.log('  3. Configure bucket policy for public read access');
  console.log('  4. Start Strapi: npm run develop');
  console.log('  5. Test upload via admin panel or API');
  process.exit(0);
} else {
  console.log('❌ Some configuration checks failed!');
  console.log('\n📝 Action Required:');
  console.log('  1. Update .env file with actual AWS credentials');
  console.log('  2. Review S3_UPLOAD_CONFIGURATION.md for details');
  console.log('  3. Run this script again to verify');
  process.exit(1);
}
