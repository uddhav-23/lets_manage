# Firebase Setup Guide

This application has been migrated from Convex to Firebase. Follow these steps to set up your Firebase environment.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

## 2. Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** provider
3. Save the changes

## 3. Create Firestore Database

1. Go to **Firestore Database** in Firebase Console
2. Click "Create database"
3. Choose **Production mode** or **Test mode** (you can change security rules later)
4. Select a location for your database
5. Click "Enable"

## 4. Set Up Storage

1. Go to **Storage** in Firebase Console
2. Click "Get started"
3. Start in production mode
4. Use the same location as your Firestore database
5. Click "Done"

## 5. Deploy Security Rules

1. Install Firebase CLI if you haven't:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init firestore
   ```
   - Select your Firebase project
   - Use the existing `firestore.rules` file
   - Say "No" to overwriting

4. Deploy the rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

## 6. Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click on the Web icon (`</>`) to add a web app
4. Register your app with a nickname
5. Copy the Firebase configuration object

## 7. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and fill in your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key-here
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

## 8. Set Up Admin Users

Admin users need to have the `admin: true` field in their user document in Firestore.

### Option 1: Manual Setup
1. Go to Firestore Database in Firebase Console
2. Create a `users` collection
3. When a user signs up, a document is created in `users/{userId}`
4. Manually edit the document and set `admin: true` for admin users

### Option 2: Cloud Function (Recommended)
Create a Cloud Function to set admin users automatically based on email addresses.

## 9. Install Dependencies and Run

```bash
npm install
npm run dev
```

## Security Rules Notes

The provided `firestore.rules` file includes:
- **Public read access** for projects and clients (landing page)
- **Public create access** for contacts and subscribers
- **Admin-only access** for managing all data
- Admin check based on `request.auth.token.admin == true`

To set admin status:
1. In Firebase Console, go to Authentication > Users
2. Find the user and click the three dots menu
3. Select "Edit user" > "Custom claims"
4. Add claim: `admin` = `true`

Or use a Cloud Function to set custom claims based on Firestore document.

## Database Structure

```
firestore/
├── contacts/
│   └── {contactId}
│       ├── fullName: string
│       ├── email: string
│       ├── mobile: string
│       ├── city: string
│       └── submittedAt: number
├── projects/
│   └── {projectId}
│       ├── name: string
│       ├── description: string
│       ├── imageId: string (Firebase Storage path)
│       └── createdAt: number
├── clients/
│   └── {clientId}
│       ├── name: string
│       ├── designation: string
│       ├── review: string
│       ├── imageId: string (Firebase Storage path)
│       └── createdAt: number
├── subscribers/
│   └── {subscriberId}
│       ├── email: string
│       └── subscribedAt: number
└── users/
    └── {userId}
        ├── email: string
        ├── admin: boolean
        └── createdAt: timestamp
```

## Troubleshooting

- **"Permission denied" errors**: Check that security rules are deployed and user has proper authentication
- **Image upload fails**: Verify Storage is enabled and rules allow uploads
- **Admin access not working**: Ensure custom claims are set correctly in Firebase Auth

