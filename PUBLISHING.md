# Publishing to Chrome Web Store

## Developer Account Options

### Personal Account (Free)
- **Cost**: One-time $5 registration fee
- **Publisher Name**: Your personal name (e.g., "John Doe" or "John Doe's Extensions")
- **Requirements**: 
  - Google account
  - Payment method for the $5 fee
  - Valid address
- **Best for**: Personal projects, open source, individual developers

### Organization Account ($5 + Verification)
- **Cost**: $5 registration + organization verification (if you want to display a company name)
- **Publisher Name**: Your company/organization name
- **Requirements**:
  - Legal business entity (LLC, Corporation, etc.)
  - Business verification documents
  - Business address
- **Best for**: Commercial products, businesses, branded extensions

## Recommendation

**For this extension, use a Personal Account** unless you:
- Plan to monetize it
- Want to build a brand around it
- Have a legal business entity already set up

The $5 personal account is sufficient and your name will appear as the publisher (e.g., "Published by [Your Name]").

## Publishing Steps

### 1. Prepare Your Extension

#### Create a ZIP file (excluding unnecessary files):
```bash
cd ~/Github/add-to-calendar-redirect
zip -r extension.zip . -x "*.git*" -x "_metadata/*" -x "*.md" -x "event-add-to-example.tsx" -x "README-ROUTE.md"
```

#### Required Files:
- ✅ manifest.json
- ✅ background.js
- ✅ settings.html
- ✅ settings.js
- ✅ icons/ (all three sizes)
- ✅ redirect.html (if still referenced)

#### Files to Exclude:
- ❌ .git/ and .gitignore
- ❌ _metadata/
- ❌ README files (optional, but not needed)
- ❌ event-add-to-example.tsx (example file)

### 2. Create Chrome Web Store Developer Account

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Sign in with your Google account
3. Pay the **one-time $5 registration fee**
4. Accept the Developer Agreement

### 3. Prepare Store Listing

You'll need to provide:

#### Required Information:
- **Name**: "Calendar Redirect" or "Add to Calendar Redirect"
- **Summary**: Short description (132 characters max)
  - Example: "Redirects Google Calendar 'Add to Calendar' links to your custom handler with all parameters preserved."
- **Description**: Detailed description
- **Category**: Productivity or Developer Tools
- **Language**: English (and others if you want)
- **Privacy Policy URL**: ⚠️ **REQUIRED** (see below)

#### Visual Assets:
- **Small tile icon** (128x128) - You have this in icons/icon128.png
- **Screenshots** (1280x800 or 640x400):
  - Screenshot of settings page
  - Screenshot showing the redirect in action (optional)
- **Promotional images** (optional but recommended):
  - Small promo tile (440x280)
  - Large promo tile (920x680)
  - Marquee promo tile (1400x560)

### 4. Privacy Policy (REQUIRED)

Since your extension uses:
- `storage` permission (sync storage for settings)
- `webNavigation` API
- `tabs` API

**You MUST provide a privacy policy URL.**

#### Options:
1. **GitHub Pages** (Free):
   - Create a `privacy-policy.html` file in your repo
   - Enable GitHub Pages
   - Use the GitHub Pages URL

2. **Your own website** (if you have one)

3. **Privacy policy generator**:
   - Use a service like [Privacy Policy Generator](https://www.privacypolicygenerator.info/)
   - Host it on GitHub Pages or your site

#### Sample Privacy Policy Points:
- Extension only stores user preferences locally (redirect URL, enabled/disabled state)
- No data is collected or transmitted to third parties
- All redirects happen locally in the user's browser
- No analytics or tracking

### 5. Upload and Submit

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Click **"New Item"**
3. Upload your ZIP file
4. Fill in the store listing information
5. Add screenshots and icons
6. Add privacy policy URL
7. Click **"Submit for Review"**

### 6. Review Process

- **Initial review**: 1-3 business days
- **Updates**: Usually faster (hours to 1 day)
- **Common rejection reasons**:
  - Missing privacy policy
  - Poor description
  - Missing screenshots
  - Violation of Chrome Web Store policies

## Important Notes

### Publisher Name Display

- **Personal Account**: Shows as "Published by [Your Name]"
- **Organization Account**: Shows as "Published by [Company Name]"
- You can change your publisher name later, but it requires verification

### Do You Need a Legal Entity?

**No, you don't need a legal entity for a personal account.** You can publish under your name.

**You only need a legal entity if:**
- You want to publish under a company/brand name
- You're building a commercial product
- You need business tax benefits

### Cost Summary

- **Personal Account**: $5 one-time (no recurring fees)
- **Organization Account**: $5 one-time + business verification (if needed)
- **No revenue share** for free extensions
- **Revenue share**: 5% for paid extensions (Chrome takes 5% of sales)

## Checklist Before Publishing

- [ ] Extension tested and working
- [ ] ZIP file created (without .git, _metadata, etc.)
- [ ] Privacy policy created and hosted
- [ ] Store listing description written
- [ ] Screenshots prepared (at least 1 required)
- [ ] Icons ready (128x128 minimum)
- [ ] Developer account created ($5 paid)
- [ ] Ready to submit!

## After Publishing

- Monitor reviews and ratings
- Respond to user feedback
- Update extension as needed
- Keep privacy policy updated if you add features

## Resources

- [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
- [Chrome Web Store Developer Program Policies](https://developer.chrome.com/docs/webstore/program-policies/)
- [Publishing Your Extension Guide](https://developer.chrome.com/docs/webstore/publish/)
