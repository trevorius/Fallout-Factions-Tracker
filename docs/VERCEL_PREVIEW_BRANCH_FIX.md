# 🚨 URGENT: Vercel Preview Branch Deployment Fix

## Problem
Preview branches are failing with `DNS_HOSTNAME_RESOLVED_PRIVATE` error, making development workflow impossible.

## Error Details
```
404: NOT_FOUND
Code: DNS_HOSTNAME_RESOLVED_PRIVATE
ID: iad1::wf9sv-1751658869690-becbe633802c
```

This means Vercel cannot resolve the preview branch hostname to a public IP address.

## 🔧 IMMEDIATE FIXES

### 1. Check Vercel Project Settings

**Go to Vercel Dashboard → Your Project → Settings:**

#### A. Git Integration
- ✅ Ensure GitHub integration is properly connected
- ✅ Check that branch deployments are enabled
- ✅ Verify repository permissions

#### B. Domains & HTTPS
- ✅ Remove any custom domains pointing to private IPs
- ✅ Ensure no CNAME records pointing to private networks
- ✅ Check DNS settings for your custom domain (if any)

#### C. Environment Variables
- ✅ Remove any `NEXTAUTH_URL` containing localhost
- ✅ Verify `DATABASE_URL` is accessible from Vercel
- ✅ Check all environment variables are properly set

### 2. Fix Build Configuration

#### A. Package.json Scripts
```json
{
  "scripts": {
    "build": "next build",
    "start": "next start",
    "dev": "next dev",
    "prebuild": "node scripts/generate-theme-css.cjs"
  }
}
```

#### B. Node.js Version
Create `.nvmrc` file:
```
20
```

### 3. Network Configuration Issues

#### A. Check for VPN/Corporate Network
- Disable VPN when testing deployments
- Try from different network (mobile hotspot)
- Check if corporate firewall is blocking Vercel

#### B. DNS Cache Issues
```bash
# Clear DNS cache (macOS)
sudo dscacheutil -flushcache

# Clear DNS cache (Windows)
ipconfig /flushdns

# Clear DNS cache (Linux)
sudo systemctl restart systemd-resolved
```

### 4. Vercel CLI Debugging

#### A. Install Vercel CLI
```bash
npm i -g vercel
```

#### B. Manual Deployment Test
```bash
# Login to Vercel
vercel login

# Link project
vercel link

# Deploy manually
vercel --prod

# Check deployment logs
vercel logs
```

#### C. Check Deployment Status
```bash
# List all deployments
vercel ls

# Get deployment details
vercel inspect [deployment-url]
```

### 5. Force Clean Deployment

#### A. Clear All Caches
1. Go to Vercel Dashboard → Project → Functions tab
2. Click "Clear All Caches"
3. Wait 5 minutes

#### B. Trigger Fresh Deployment
```bash
# Force new commit
git commit --allow-empty -m "🔄 Force fresh deployment"
git push origin [branch-name]

# Or use Vercel CLI
vercel --force
```

### 6. Regional Issues

The error shows `iad1` region. Try forcing different region:

#### A. Create vercel.json (if needed)
```json
{
  "regions": ["sfo1", "cle1", "dub1"]
}
```

#### B. Or use CLI
```bash
vercel --regions sfo1
```

## 🔍 DIAGNOSTIC STEPS

### 1. Check Vercel Status
Visit: https://vercel-status.com

### 2. Test with Minimal App
Create a test branch with minimal Next.js app to isolate the issue.

### 3. Network Diagnostics
```bash
# Test DNS resolution
nslookup fallout-factions-tracker-git-cursor-a-59daec-trevorius-projects.vercel.app

# Test connectivity
curl -I https://fallout-factions-tracker-git-cursor-a-59daec-trevorius-projects.vercel.app

# Check IP resolution
dig fallout-factions-tracker-git-cursor-a-59daec-trevorius-projects.vercel.app
```

### 4. Browser Diagnostics
```javascript
// Open browser console and run:
console.log('Host:', window.location.host);
console.log('Protocol:', window.location.protocol);
```

## 🚨 EMERGENCY WORKAROUNDS

### Option 1: Use Production Branch
```bash
# Deploy to production for testing
git checkout main
git merge [your-branch]
git push origin main
```

### Option 2: Local Development with Tunnel
```bash
# Install ngrok
npm install -g ngrok

# Start local server
npm run dev

# In another terminal, create tunnel
ngrok http 3000
```

### Option 3: Alternative Preview Service
```bash
# Use Vercel CLI for temporary preview
vercel

# Or use GitHub Codespaces
# Or use Netlify for quick preview
```

## 🎯 ROOT CAUSE ANALYSIS

Common causes of this error:

1. **DNS Configuration Issues**
   - Custom domain pointing to private IP
   - Incorrect CNAME records
   - Corporate DNS filtering

2. **Vercel Infrastructure Issues**
   - Regional outages
   - Edge network problems
   - CDN configuration issues

3. **Project Configuration Problems**
   - Incorrect build settings
   - Invalid environment variables
   - Conflicting middleware

4. **Network Connectivity Issues**
   - VPN blocking Vercel
   - Firewall restrictions
   - ISP DNS issues

## ✅ SUCCESS CRITERIA

The fix is successful when:
- ✅ Preview branches deploy without DNS errors
- ✅ Preview URLs are accessible from any network
- ✅ All routes (`/`, `/en`, `/fr`) work correctly
- ✅ Authentication flows work on preview branches

## 📞 ESCALATION

If none of these fixes work:

1. **Contact Vercel Support**
   - Include the exact error ID: `iad1::wf9sv-1751658869690-becbe633802c`
   - Mention "DNS_HOSTNAME_RESOLVED_PRIVATE"
   - Provide project URL and affected branch

2. **Vercel Community**
   - Post on Vercel Discussions
   - Include error details and troubleshooting attempts

3. **Alternative Deployment**
   - Consider Netlify or Railway as backup
   - Use GitHub Pages for static preview

**This is a critical deployment infrastructure issue that needs immediate resolution.** 🚨