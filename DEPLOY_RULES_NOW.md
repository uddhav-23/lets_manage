# ⚠️ IMPORTANT: Deploy Firestore Rules NOW

You're getting "Missing or insufficient permissions" because **the Firestore rules haven't been deployed yet**.

## Quick Fix - Deploy Rules via Firebase Console:

### Step 1: Deploy Firestore Rules
1. Go to: **https://console.firebase.google.com/project/flipr-b90a3/firestore/rules**
2. **Copy ALL the content** from `firestore.rules` file in this project
3. **Paste it** into the Firebase Console editor
4. Click **"Publish"** button
5. Wait for confirmation (green checkmark)

### Step 2: Deploy Storage Rules
1. Go to: **https://console.firebase.google.com/project/flipr-b90a3/storage/rules**
2. **Copy ALL the content** from `storage.rules` file in this project
3. **Paste it** into the Firebase Console editor
4. Click **"Publish"** button
5. Wait for confirmation (green checkmark)

### Step 3: Verify
After deploying:
1. Make sure you're **logged in** to the admin panel
2. Go to the **Contacts** page
3. It should work now!

## What the Rules Do:

- ✅ **Contacts**: Anyone can create (landing page), authenticated users can read (admin panel)
- ✅ **Subscribers**: Anyone can create (landing page), authenticated users can read (admin panel)  
- ✅ **Projects/Clients**: Public read (landing page), authenticated write (admin panel)
- ✅ **Storage**: Public read, authenticated write

**The rules require you to be logged in to view contacts in the admin panel.**

