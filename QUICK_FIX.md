# Quick Fix Guide

## The Permission Error Fix

The rules have been updated to allow all reads and writes for testing. 

### To Deploy Rules:

1. **Initialize Firebase:**
```bash
firebase init firestore
```
- Choose "Use an existing project" and select `flipr-b90a3`
- Use existing `firestore.rules` file (say No to overwrite)

2. **Initialize Storage:**
```bash
firebase init storage
```
- Use existing `storage.rules` file (say No to overwrite)

3. **Deploy Rules:**
```bash
firebase deploy --only firestore:rules,storage:rules
```

### Alternative: Use Test Mode in Firebase Console

If you can't deploy rules right now:

1. Go to Firestore Console: https://console.firebase.google.com/project/flipr-b90a3/firestore/rules
2. Change rules to test mode (allow all reads/writes)
3. Click "Publish"

The rules files are already set to allow everything, so once deployed, contacts and newsletter should work immediately!

