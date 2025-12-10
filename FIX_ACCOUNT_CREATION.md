# Fix Account Creation Issue

## Common Causes:

### 1. Firebase Authentication Not Enabled
**Problem:** Email/Password provider is not enabled in Firebase Console.

**Solution:**
1. Go to: https://console.firebase.google.com/project/flipr-b90a3/authentication/providers
2. Click on **"Email/Password"**
3. Enable **"Email/Password"** (toggle ON)
4. Click **"Save"**

### 2. Firestore Permission Error
**Problem:** User document creation might fail due to Firestore rules.

**Solution:**
The current rules allow authenticated users to create their own user document. If you see permission errors:
1. Check browser console for specific error messages
2. Verify Firestore rules are deployed (see `firestore.rules`)
3. The user will still be created in Firebase Auth even if Firestore document creation fails

### 3. Check Browser Console
**Open browser DevTools (F12) → Console tab** to see detailed error messages.

Common errors you might see:
- `auth/operation-not-allowed` → Enable Email/Password in Firebase Console
- `auth/email-already-in-use` → Email already registered
- `auth/weak-password` → Password too short (needs 6+ characters)
- `auth/invalid-email` → Invalid email format
- `permission-denied` → Firestore rules issue

### 4. Test Steps:
1. Open browser console (F12)
2. Try to create an account
3. Check the console for error messages
4. Share the error message if it persists

## Quick Fix Checklist:

- [ ] Enable Email/Password in Firebase Console
- [ ] Check browser console for errors
- [ ] Verify password is at least 6 characters
- [ ] Verify email format is correct
- [ ] Check if Firestore rules are deployed

## Updated Code:
The code now shows more specific error messages to help identify the issue.

