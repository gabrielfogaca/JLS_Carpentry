# Firebase setup and upload verification

The existing site uses **Realtime Database + Authentication + Cloud Storage**.
There is no Firestore migration. `firestore.rules` is deliberately unchanged.

## 1. Check the existing project

In Firebase Console, select `jls-carpentry`:

- Project settings → Your apps: use the configuration of the same registered web app for every `VITE_FIREBASE_*` value. `.env.local` overrides `.env`; restart Vite after changing environment values.
- Authentication → Sign-in method: enable Email/Password. Create or identify the owner's account in Users.
- Realtime Database: verify its URL matches `VITE_FIREBASE_DATABASE_URL`.
- Storage: finish bucket setup, verify its exact name matches `VITE_FIREBASE_STORAGE_BUCKET`, and check the billing/quota requirements shown by the console. A configured bucket name alone does not create storage.

Never put service account credentials or an administrator SDK key in a `VITE_*` variable. These variables are included in the public website bundle.

## 2. Grant administrator access

Both the dashboard and the new database/storage rules require the Firebase Auth custom claim **`admin: true`**. Existing email/password accounts do not automatically receive this claim.

Run the following **once in a trusted server environment**, such as Google Cloud Shell with the correct project and authorized Application Default Credentials. This is an administrative operation; it must never be added to the frontend. Install `firebase-admin` in that environment first (`npm install firebase-admin`), then run this Node script after replacing `ADMIN_USER_UID` with the UID from Authentication → Users:

```js
const { initializeApp, applicationDefault } = require('firebase-admin/app')
const { getAuth } = require('firebase-admin/auth')

initializeApp({ credential: applicationDefault(), projectId: 'jls-carpentry' })
async function grantAdmin() {
  const auth = getAuth()
  const user = await auth.getUser('ADMIN_USER_UID')
  await auth.setCustomUserClaims(user.uid, { ...user.customClaims, admin: true })
  console.log('Administrator access granted.')
}
grantAdmin().catch((error) => { console.error(error); process.exitCode = 1 })
```

Sign out and back in, or click **Check access again**, to refresh the token. Removing `admin` later revokes access when the user's ID token refreshes.

Reference: [Firebase custom claims](https://firebase.google.com/docs/auth/admin/custom-claims).

## 3. Publish the rules

Before publishing, review/back up existing rules in the console. The supplied rules cover the paths used by this application; other paths are denied. Unpublished local rules do not protect the remote project.

Either paste `database.rules.json` into Realtime Database → Rules and `storage.rules` into Storage → Rules, or authenticate the CLI and publish:

```sh
npx firebase-tools login
npm run deploy:rules
```

The deploy command targets only Realtime Database and Storage, not Firestore. Public visitors can read the published site content and image files. Only accounts with `admin: true` can read the media library or write content/files. Uploads accept JPG, PNG, WebP, GIF and AVIF images up to 10 MB, consistent with the frontend.

Reference: [Storage upload errors](https://firebase.google.com/docs/storage/web/handle-errors).

## 4. Verify the full flow

1. Open `/admin` signed out. It should display login.
2. Sign in with an ordinary account. Editing must remain unavailable.
3. Sign in with the administrator account. Open Portfolio and choose **Upload to this project**.
4. Confirm immediate progress feedback, followed by a thumbnail in **Choose cover from library**. If it fails, the UI identifies the failed operation; the browser console contains the original Firebase error.
5. Select a cover and a gallery photo, choose homepage visibility, then **Save changes**.
6. Return to the site, reload, and confirm the project cover/gallery and visibility persist. **Back to site** preserves the session; **Log out** ends it.
7. Try an unsupported file or an image larger than 10 MB: reject before uploading.
8. Deny media/content access temporarily in a test environment and verify retry/error feedback and preservation of unsaved edits. Never test destructive rules against production data.

Uploading saves the file and its library entry immediately. Project text, cover and gallery choices are published only by **Save changes**. Local tests do not prove remote rules, billing or credentials are configured correctly.

## Local regression checks

```sh
npm run check
npm test
npm run test:e2e
npm run build
```

Browser checks use an installed Chrome and isolated Firebase test doubles. They cover route changes, administrator access, upload/metadata failures, library selection/retry, persistence after reload, and preservation of drafts. They never connect to the real Firebase project. The development server is reused when available.
