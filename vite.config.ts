import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

import fs from 'fs';

function fileUploadPlugin() {
  return {
    name: 'file-upload-plugin',
    configureServer(server: any) {
      server.middlewares.use('/api/upload', (req: any, res: any, next: any) => {
        if (req.method === 'POST') {
          const url = new URL(req.url, `http://${req.headers.host}`);
          const fileName = url.searchParams.get('name') || 'resume.pdf';
          const uploadDir = path.resolve(__dirname, 'public/resume');

          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }

          const filePath = path.join(uploadDir, fileName);
          const writeStream = fs.createWriteStream(filePath);
          req.pipe(writeStream);

          req.on('end', () => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ resumeUrl: `/resume/${fileName}` }));
          });

          req.on('error', () => {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Upload failed' }));
          });
        } else {
          next();
        }
      });

      server.middlewares.use('/api/upload-profile', (req: any, res: any, next: any) => {
        if (req.method === 'POST') {
          const url = new URL(req.url, `http://${req.headers.host}`);
          const rawName = url.searchParams.get('name') || `profile_${Date.now()}.jpg`;
          const ext = path.extname(rawName) || '.jpg';
          const safeBase = path.basename(rawName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
          const fileName = `${Date.now()}_${safeBase}${ext}`;
          const uploadDir = path.resolve(__dirname, 'public/profiles');

          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }

          const filePath = path.join(uploadDir, fileName);
          const writeStream = fs.createWriteStream(filePath);
          req.pipe(writeStream);

          req.on('end', () => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ photoUrl: `/profiles/${fileName}` }));
          });

          req.on('error', (err: any) => {
            console.error('Profile photo upload error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Upload failed' }));
          });
        } else {
          next();
        }
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react(), fileUploadPlugin()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
