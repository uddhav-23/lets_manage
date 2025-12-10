# 🚀 Quick Deployment Checklist

## 1. Deploy Firebase Rules (2 minutes)

### Firestore Rules:
1. Go to: https://console.firebase.google.com/project/flipr-b90a3/firestore/rules
2. Copy ALL content from `firestore.rules` file
3. Paste and click **"Publish"**

### Storage Rules:
1. Go to: https://console.firebase.google.com/project/flipr-b90a3/storage/rules
2. Copy ALL content from `storage.rules` file
3. Paste and click **"Publish"**

## 2. Verify Firebase Services (1 minute)

- ✅ Authentication enabled (Email/Password)
- ✅ Firestore Database created
- ✅ Storage enabled

## 3. Test Locally (2 minutes)

```bash
npm run dev
```

Test:
- ✅ Landing page loads
- ✅ Contact form submits
- ✅ Newsletter subscribes
- ✅ Admin login works
- ✅ Image upload works (now optimized)

## 4. Build for Production (1 minute)

```bash
npm run build
```

## 5. Deploy to GitHub (2 minutes)

```bash
git add .
git commit -m "Deploy: Firebase migration complete, optimized image uploads"
git push origin main
```

## 6. Deploy to Hosting (Vercel/Netlify) (5 minutes)

### Vercel:
1. Import GitHub repo
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add environment variables from `.env.local`

### Netlify:
1. Import GitHub repo
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables from `.env.local`

## 7. Add Environment Variables to Hosting

Copy all from `.env.local`:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

## ✅ Total Time: ~15 minutes

**Optimizations Made:**
- ✅ Image upload quality reduced to 0.75 (faster)
- ✅ Removed timeout delays
- ✅ Simplified upload code
- ✅ Fixed permission rules

