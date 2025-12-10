# Fix Permission Errors - Step by Step

## Problem
You're getting "Missing or insufficient permissions" errors because Firestore security rules are blocking access.

## Solution: Update Rules in Firebase Console

Since the project `flipr-b90a3` might not be accessible via CLI, update rules directly in the console:

### Step 1: Go to Firestore Rules
1. Open: https://console.firebase.google.com/project/flipr-b90a3/firestore/rules
2. Replace ALL the existing rules with this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Click **"Publish"**

### Step 2: Go to Storage Rules
1. Open: https://console.firebase.google.com/project/flipr-b90a3/storage/rules
2. Replace ALL the existing rules with this:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

3. Click **"Publish"**

### Step 3: Verify Firestore is Enabled
1. Go to: https://console.firebase.google.com/project/flipr-b90a3/firestore
2. If you see "Create database", click it
3. Choose "Start in test mode"
4. Select a location
5. Click "Enable"

### Step 4: Verify Storage is Enabled
1. Go to: https://console.firebase.google.com/project/flipr-b90a3/storage
2. If you see "Get started", click it
3. Choose "Start in test mode"
4. Click "Done"

### Step 5: Test
After updating rules:
1. Submit a contact from the landing page
2. Subscribe to newsletter
3. Check admin panel → Contacts page (should refresh automatically)

**Note:** These rules allow ALL reads and writes. For production, you should restrict them after testing.

