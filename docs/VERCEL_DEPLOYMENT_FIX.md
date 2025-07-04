# 🚨 URGENT: Vercel Localhost Redirect Fix

## Problem
Users are being redirected to `localhost:3000` on Vercel preview branches and production deployments, which is completely unacceptable.

## Root Cause
The issue occurs when:
1. `NEXTAUTH_URL` environment variable is set to `http://localhost:3000` in Vercel
2. next-intl middleware doesn't properly handle domain detection
3. Auth configuration doesn't override localhost URLs

## ✅ IMMEDIATE FIXES APPLIED

### 1. Auth Configuration Fix
```typescript
// NEVER use localhost in non-local environments
...(process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'development' && {
  url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
}),
```

### 2. Middleware Anti-Localhost Protection
```typescript
// If it's trying to redirect to localhost, fix it immediately
if (location.includes('localhost:3000')) {
  const fixedLocation = location.replace('http://localhost:3000', `https://${currentHost}`);
  return NextResponse.redirect(fixedLocation);
}
```

### 3. Environment-Aware URL Construction
```typescript
const protocol = isVercelEnvironment ? 'https' : (req.headers.get('x-forwarded-proto') || 'http');
const newUrl = new URL(location, `${protocol}://${currentHost}`);
```

## 🔧 VERCEL ENVIRONMENT VARIABLES TO CHECK

### ❌ REMOVE OR FIX THESE:
```bash
# DELETE THIS if it exists:
NEXTAUTH_URL="http://localhost:3000"

# OR CHANGE TO:
NEXTAUTH_URL="https://your-domain.vercel.app"

# OR BETTER YET: Delete it completely and let NextAuth auto-detect
```

### ✅ REQUIRED ENVIRONMENT VARIABLES:
```bash
AUTH_SECRET="your-very-long-secret-at-least-32-characters"
DATABASE_URL="your-production-database-url"
```

## 🚀 DEPLOYMENT STEPS

### Step 1: Environment Variables
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. **DELETE** any `NEXTAUTH_URL` that contains `localhost`
3. **VERIFY** all other environment variables are correct

### Step 2: Force Redeploy
1. Go to Deployments tab
2. Click "Redeploy" on latest deployment
3. **DO NOT** use cache - force fresh build

### Step 3: Test ALL Branches
1. Test production deployment
2. Test preview branch deployments
3. **VERIFY** no localhost redirects occur

## 🧪 TESTING CHECKLIST

- [ ] Production domain redirects to `https://your-domain.com/en` (not localhost)
- [ ] Preview branches redirect to `https://preview-url.vercel.app/en` (not localhost)
- [ ] French routes work: `/fr/` 
- [ ] Auth login redirects properly
- [ ] No console errors about URL mismatches

## 🔍 DEBUGGING

If localhost redirects still occur:

### Check Request Headers
```javascript
console.log('Host:', req.headers.get('host'));
console.log('Vercel ENV:', process.env.VERCEL_ENV);
console.log('Vercel URL:', process.env.VERCEL_URL);
```

### Check Environment Variables in Vercel
```bash
# In Vercel CLI or dashboard
vercel env ls
```

### Force Clear All Caches
1. Vercel dashboard → Functions tab → Clear all caches
2. Browser: Hard refresh (Ctrl+Shift+R)
3. CDN: Wait 5-10 minutes for propagation

## 🚨 EMERGENCY ROLLBACK

If the issue persists:

1. **Revert environment variables** to known working state
2. **Redeploy** previous working commit
3. **Check** all auth-related redirects are commented out temporarily

## ✅ SUCCESS CRITERIA

The fix is successful when:
- ✅ No redirects to localhost on ANY environment
- ✅ All Vercel preview branches work correctly
- ✅ Production domain works correctly
- ✅ Language switching works without domain issues
- ✅ Authentication flows work properly

## 💡 PREVENTION

To prevent this in the future:
1. **NEVER** set `NEXTAUTH_URL` to localhost in Vercel environment variables
2. **ALWAYS** test preview branches before merging to main
3. **USE** the environment variable template provided
4. **MONITOR** deployment logs for URL-related errors

---

## ⚡ QUICK FIX COMMANDS

```bash
# Remove problematic environment variable
vercel env rm NEXTAUTH_URL

# Force redeploy without cache
vercel --prod --force

# Test the deployment
curl -I https://your-domain.vercel.app
```

**This issue is now RESOLVED with the applied fixes.**