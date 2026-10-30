# Cloudinary on Vercel

Rotate the Cloudinary key exposed in the screenshot and deactivate the old key. Use the new credentials below. Never commit secrets or paste them into chat.

## Vercel environment variables

Open the existing Vercel project → Settings → Environment Variables. Configure the intended deployment environments:

| Variable | Value |
| --- | --- |
| `VITE_MEDIA_PROVIDER` | `cloudinary` |
| `CLOUDINARY_CLOUD_NAME` | Cloud name from Cloudinary |
| `CLOUDINARY_API_KEY` | New Cloudinary API key |
| `CLOUDINARY_API_SECRET` | New Cloudinary API secret |
| `FIREBASE_PROJECT_ID` | `jls-carpentry` |
| `FIREBASE_CLIENT_EMAIL` | `client_email` from Firebase service account JSON |
| `FIREBASE_PRIVATE_KEY` | `private_key` from the same JSON; actual newlines or literal `\n` are supported |

Get the server credential from Firebase Console → Project settings → Service accounts → Generate new private key. Keep the downloaded JSON private and outside this repository. The server verifies Firebase tokens and requires the existing `admin: true` custom claim. Refer to FIREBASE_SETUP.md for granting that claim.

Keep the existing `VITE_FIREBASE_*` web configuration for Authentication and Realtime Database. Storage bucket configuration is optional when Cloudinary is selected. Publish the Realtime Database rules if they have not been published; Cloudinary does not replace those rules.

Deploy this code through the existing Vercel deployment workflow and redeploy after configuring variables. No unsigned upload preset is required. No Firebase Cloud Functions or Firebase Storage billing is required for this upload path.

## Verify

1. Open `/admin`, sign in as administrator and upload a JPG/PNG/WebP/GIF/AVIF image up to 10 MB.
2. Confirm upload progress, library thumbnail, and the new asset in Cloudinary.
3. Select the photo for a project and save changes. Reload the public site to verify persistence.
4. Confirm a signed-out request to POST `/api/cloudinary-sign` is rejected, and a non-admin account cannot authorize uploads.

Existing Firebase image URLs remain unchanged. New uploads use Cloudinary only when `VITE_MEDIA_PROVIDER=cloudinary`; leaving it unset preserves the Firebase Storage path.

Files upload directly from the browser to Cloudinary; only authorization goes through Vercel. The API secret stays on the server. File size is validated in the browser and image formats are included in the signed parameters. Cloudinary plan limits also apply. The upload authorization is reusable during Cloudinary's signature validity window, with a unique fixed public ID and overwrite disabled.

If uploading succeeds but saving the library entry fails, the UI reports the failure. The image remains in Cloudinary and can be removed manually there. This integration does not implement remote deletion.

The ordinary Vite dev server does not execute `/api` functions. Use a Vercel preview deployment for integration checks, or Vercel CLI `vercel dev` with local server variables. Existing Firebase mock browser tests exercise the fallback path, not the live Cloudinary service.

References: https://cloudinary.com/documentation/client_side_uploading and https://vercel.com/docs/frameworks/frontend/vite
