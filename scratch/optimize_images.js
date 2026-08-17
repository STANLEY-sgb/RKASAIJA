import fs from 'fs';
import path from 'path';

// Let's check sharp availability or fallbacks
async function run() {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
    console.log('Sharp loaded successfully');
  } catch (e) {
    console.log('Sharp not available yet:', e.message);
  }

  const publicDirs = [
    'public/assets/images/logo',
    'public/assets/images/hero',
    'public/assets/images/team',
    'public/assets/images/team-members',
  ];

  publicDirs.forEach(dir => {
    fs.mkdirSync(dir, { recursive: true });
  });

  const srcDir = 'assets/img';
  const files = fs.readdirSync(srcDir);
  console.log('Source images in assets/img:', files);

  // Copy files to public/assets/images and optimize if sharp available
  for (const file of files) {
    const srcPath = path.join(srcDir, file);
    if (!fs.statSync(srcPath).isFile()) continue;

    if (file === 'firm_logo.jpeg') {
      const destJpeg = 'public/assets/images/logo/firm-logo.jpeg';
      fs.copyFileSync(srcPath, destJpeg);
      if (sharp) {
        await sharp(srcPath).webp({ quality: 90 }).toFile('public/assets/images/logo/firm-logo.webp');
      }
    } else if (file === 'FIRM  TEAM PIC.png' || file === 'law_firm_team.jpeg') {
      const targetName = file === 'FIRM  TEAM PIC.png' ? 'firm-team-full' : 'firm-team-landscape';
      fs.copyFileSync(srcPath, `public/assets/images/team/${file}`);
      if (sharp) {
        await sharp(srcPath).resize({ width: 2400, withoutEnlargement: true }).webp({ quality: 92 }).toFile(`public/assets/images/team/${targetName}.webp`);
        await sharp(srcPath).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 90 }).toFile(`public/assets/images/team/${targetName}-md.webp`);
      }
    } else if (file.startsWith('counsel_')) {
      const advocateName = file.replace('counsel_', '').replace('.jpeg', '').replace('.jpg', '');
      // Copy to hero and team-members
      fs.copyFileSync(srcPath, `public/assets/images/hero/${file}`);
      fs.copyFileSync(srcPath, `public/assets/images/team-members/${file}`);

      if (sharp) {
        await sharp(srcPath).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 90 }).toFile(`public/assets/images/hero/${advocateName}.webp`);
        await sharp(srcPath).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 90 }).toFile(`public/assets/images/team-members/${advocateName}.webp`);
      }
    }
  }
  console.log('Image organization completed!');
}

run().catch(console.error);
