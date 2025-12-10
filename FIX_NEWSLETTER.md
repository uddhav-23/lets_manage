# Fix Newsletter Subscription

## Common Issues:

### 1. Firestore Rules Not Deployed
**Problem:** Rules allow subscriptions but they're not deployed to Firebase.

**Solution:**
1. Go to: https://console.firebase.google.com/project/flipr-b90a3/firestore/rules
2. Copy ALL content from `firestore.rules` file
3. Paste and click **"Publish"**
4. Wait for confirmation

### 2. Check Browser Console
**Open browser DevTools (F12) → Console tab** to see detailed error messages.

### 3. Test the Rules
The current rules allow:
- ✅ Anyone can create subscribers (anonymous)
- ✅ Authenticated users can read subscribers

### 4. Verify Firestore is Enabled
1. Go to: https://console.firebase.google.com/project/flipr-b90a3/firestore
2. Make sure database is created
3. Check if "subscribers" collection exists (it will be created automatically)

## Updated Code:
- Better error handling
- Improved duplicate checking
- More specific error messages
- Console logging for debugging

## Quick Test:
1. Open browser console (F12)
2. Try to subscribe
3. Check console for error messages
4. Share the error if it persists

