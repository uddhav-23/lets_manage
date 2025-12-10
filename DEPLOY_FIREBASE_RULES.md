# Quick Guide to Deploy Firebase Rules

## Step 1: Initialize Firebase (if not done)
```bash
firebase init firestore
```
- Select your project: `flipr-b90a3`
- Use existing `firestore.rules` file (say No to overwrite)
- Use existing `firestore.indexes.json` or create new

## Step 2: Initialize Storage
```bash
firebase init storage
```
- Use existing `storage.rules` file (say No to overwrite)

## Step 3: Deploy Rules
```bash
firebase deploy --only firestore:rules,storage:rules
```

This will deploy both Firestore and Storage security rules.

## Important: After Deployment

1. **Contacts will work immediately** - rules allow anonymous writes
2. **Subscribers will work immediately** - rules allow anonymous writes
3. **Check browser console** for any permission errors

## If you still get errors:

1. **Make sure Firestore is enabled:**
   - Go to: https://console.firebase.google.com/project/flipr-b90a3/firestore
   - Click "Create database" if not already created
   - Choose "Start in test mode" initially

2. **Check the browser console** for specific error messages

3. **Verify rules are deployed:**
   - Firestore: https://console.firebase.google.com/project/flipr-b90a3/firestore/rules
   - Storage: https://console.firebase.google.com/project/flipr-b90a3/storage/rules

