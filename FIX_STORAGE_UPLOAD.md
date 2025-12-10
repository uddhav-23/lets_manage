# Fix Firebase Storage Image Upload Issues

## Important: Firestore vs Firebase Storage

**Firestore cannot store images directly.** It's a NoSQL database for storing documents with text/number fields.

**Firebase Storage** is the correct service for storing images/files. We store the image in Storage and save the image path/URL in Firestore (which we're already doing correctly).

## Common Issues and Fixes

### Issue 1: Storage Rules Not Deployed

The Storage rules must be deployed to Firebase. If they're not deployed, uploads will fail.

**Fix: Deploy Storage Rules**

1. **Via Firebase Console (Easiest):**
   - Go to: https://console.firebase.google.com/project/flipr-b90a3/storage/rules
   - Copy the content from `storage.rules` file
   - Paste it into the editor
   - Click **"Publish"**

2. **Via Firebase CLI:**
   ```bash
   firebase login
   firebase deploy --only storage:rules
   ```

### Issue 2: Not Authenticated

Storage rules require authentication. Make sure you're logged in to the admin panel.

**Check:**
- Open browser console (F12)
- Look for authentication errors
- Try logging out and logging back in

### Issue 3: Storage Not Enabled

Firebase Storage must be enabled in your Firebase project.

**Fix:**
1. Go to: https://console.firebase.google.com/project/flipr-b90a3/storage
2. If you see "Get started", click it
3. Choose "Start in production mode"
4. Select a location (same as Firestore)
5. Click "Done"

### Issue 4: Storage Bucket Name Mismatch

Check that the storage bucket name in `src/lib/firebase.ts` matches your Firebase project.

**Current config:**
```typescript
storageBucket: "flipr-b90a3.firebasestorage.app"
```

**Verify:**
1. Go to: https://console.firebase.google.com/project/flipr-b90a3/settings/general
2. Scroll to "Your apps" section
3. Check the storage bucket name matches

## Quick Diagnostic Steps

1. **Check Authentication:**
   - Open browser console (F12)
   - Try uploading an image
   - Look for error messages
   - Check if you see "Permission denied" or "Unauthorized"

2. **Check Storage Rules:**
   - Go to: https://console.firebase.google.com/project/flipr-b90a3/storage/rules
   - Verify the rules match `storage.rules` file
   - Rules should allow `write: if isAuthenticated()` for projects/clients

3. **Test Storage Access:**
   - Go to: https://console.firebase.google.com/project/flipr-b90a3/storage
   - Try manually uploading a file via the console
   - If this works, the issue is with the code/authentication
   - If this fails, the issue is with Storage setup

## Current Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isAuthenticated() {
      return request.auth != null;
    }
    
    match /projects/{imageId} {
      allow read: if true;
      allow write: if isAuthenticated();
    }
    
    match /clients/{imageId} {
      allow read: if true;
      allow write: if isAuthenticated();
    }
    
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## Next Steps

1. **Deploy Storage Rules** (most common issue)
2. **Verify you're logged in** when uploading
3. **Check browser console** for specific error messages
4. **Verify Storage is enabled** in Firebase Console

If issues persist, check the browser console for the exact error code and message.

