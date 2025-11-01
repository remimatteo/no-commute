# Logo & Hero Image Setup Guide

## Part 1: Create Your Logo

### Recommended Logo Creation Sites (FREE)

#### 1. **Canva** ⭐ BEST OPTION
**URL:** https://www.canva.com/create/logos/

**Why Use It:**
- Easiest to use
- Professional templates
- Free tier is excellent
- Can customize colors, fonts, icons

**Steps:**
1. Go to Canva.com and sign up (free)
2. Search for "Logo" templates
3. Choose a clean, modern template
4. Customize with your brand:
   - Company name: "No Commute"
   - Tagline options: "Work from Anywhere" or "Remote Jobs Simplified"
   - Colors: Blue (#3B82F6) + White/Black for contrast
   - Icons: Look for remote work symbols (laptop, location pin, globe, home office)

**Recommended Style:**
- **Modern & Clean** (not too busy)
- **Professional** (you're a job board, not a game)
- **Icon + Text** format works best
- **High contrast** (readable on both light and dark backgrounds)

**Export Settings:**
- Download as PNG (transparent background)
- Size: 512x512px minimum
- Name it: `logo.png`

#### 2. **Hatchful by Shopify**
**URL:** https://www.shopify.com/tools/logo-maker

**Pros:**
- Simple wizard-style process
- Generates multiple variations
- Completely free, no signup needed

**Steps:**
1. Visit the URL
2. Choose "Technology" or "Services" as your industry
3. Select a modern, clean style
4. Enter "No Commute"
5. Download all variations (light/dark versions)

#### 3. **LogoMakr**
**URL:** https://logomakr.com

**Pros:**
- Very simple interface
- Huge icon library
- Free to use

**Cons:**
- Free logos have low resolution (but usually fine for web)

---

## Part 2: Where to Put Your Logo

### Current Logo Location:
Your logo is stored in: `/public/logo.png`

### Replace Steps:
1. Create your logo using one of the sites above
2. Download it as PNG (transparent background preferred)
3. Replace the file at: `/public/logo.png`
4. Optionally create dark mode version: `/public/logo-dark.png`

### File Location in Your Computer:
```
C:\Users\Potato 99\Desktop\no-commute\public\logo.png
```

### Logo Specifications:
- **Format:** PNG (with transparent background)
- **Dimensions:** 512x512px (minimum) or 1024x1024px (recommended)
- **File size:** Under 100KB if possible
- **Color:** Should work on both dark and light backgrounds

---

## Part 3: Get Your Hero Background Image

### Best Free Stock Photo Sites:

#### 1. **Unsplash** ⭐ RECOMMENDED
**URL:** https://unsplash.com

**Search Terms to Try:**
- "remote work" - https://unsplash.com/s/photos/remote-work
- "laptop workspace" - https://unsplash.com/s/photos/laptop-workspace
- "home office" - https://unsplash.com/s/photos/home-office
- "work from home" - https://unsplash.com/s/photos/work-from-home
- "digital nomad" - https://unsplash.com/s/photos/digital-nomad
- "workspace" - https://unsplash.com/s/photos/workspace

**Recommended Images:**
- Clean, modern workspace with laptop
- Aerial view of laptop on desk with coffee
- Person working outdoors with laptop
- Minimalist home office setup
- Co-working space vibe

#### 2. **Pexels**
**URL:** https://www.pexels.com

**Same search terms as above**

#### 3. **Pixabay**
**URL:** https://pixabay.com

**Good for variety, but quality can be hit or miss**

---

## Part 4: Where to Put Your Hero Image

### File Location:
Place your downloaded image here:
```
C:\Users\Potato 99\Desktop\no-commute\public\hero-background.jpg
```

### Hero Image Specifications:
- **Format:** JPG (for photos) or PNG (for graphics)
- **Dimensions:** 1920x1080px minimum (Full HD)
- **Aspect Ratio:** 16:9 works best
- **File size:** Under 500KB (compress if needed using TinyPNG.com)
- **Style:** Subtle, not too busy - should work as a background

### Image Style Tips:
✅ **Good choices:**
- Minimal distractions
- Neutral colors (blues, grays, whites)
- Professional atmosphere
- High quality/sharp focus

❌ **Avoid:**
- Too busy/cluttered
- Dark or low-light photos
- Heavy text overlays
- Copyrighted brand logos visible

---

## Part 5: Test Your Changes

After adding your logo and hero image:

### 1. Logo Test:
- Visit your homepage
- Check if logo appears in header
- Test on mobile (should still be visible)
- Try both light and dark modes

### 2. Hero Image Test:
- Visit homepage
- You should see a subtle background image behind the main headline
- It should NOT be too distracting
- Text should still be easily readable
- Try both light and dark modes

### 3. Adjust Opacity if Needed:
If the hero background is too strong/distracting, edit this file:
`pages/index.js` - Line 585

Change opacity values:
```javascript
opacity: darkMode ? 0.15 : 0.08
```

Try different values:
- **0.05** = Very subtle
- **0.10** = Subtle (recommended)
- **0.15** = Noticeable
- **0.20** = Strong

---

## Part 6: Compress Your Images (Optional but Recommended)

Large image files slow down your site. Compress them!

### Best Free Image Compressors:

1. **TinyPNG** - https://tinypng.com
   - Drag and drop PNG/JPG
   - Compresses without visible quality loss
   - Downloads automatically

2. **Squoosh** - https://squoosh.app
   - More control over compression settings
   - Shows before/after comparison
   - By Google Chrome team

**Target File Sizes:**
- Logo: Under 50KB
- Hero background: Under 300KB

---

## Part 7: Quick Checklist

- [ ] Create logo on Canva/Hatchful/LogoMakr
- [ ] Download logo as PNG (transparent background)
- [ ] Replace `/public/logo.png` with your new logo
- [ ] Find hero image on Unsplash/Pexels
- [ ] Download hero image (1920x1080px minimum)
- [ ] Compress hero image (TinyPNG)
- [ ] Save as `/public/hero-background.jpg`
- [ ] Test homepage (light and dark mode)
- [ ] Adjust opacity if needed
- [ ] Clear browser cache and check again

---

## Part 8: Current Status

✅ **Code is ready** - Hero background support has been added to homepage
✅ **File path configured** - Looking for `/public/hero-background.jpg`

**What you need to do:**
1. Create your logo
2. Find your hero image
3. Place both files in the `/public/` folder
4. Restart your dev server: `npm run dev`
5. Visit http://localhost:3000 to see changes

---

## Pro Tips

### Logo Design:
- Keep it simple - complicated logos don't scale well
- Use no more than 2-3 colors
- Make sure it works in monochrome (for favicons)
- Test at different sizes (header, mobile, browser tab)

### Hero Image:
- Landscape orientation works best
- Center-focused images look great
- Test with real text overlay before finalizing
- Consider seasonal variations (you can swap images later)

### Brand Consistency:
- Use the same color palette across logo, buttons, and accents
- Your primary blue is `#3B82F6` - use this in your logo too
- Keep fonts clean and modern (sans-serif)

---

## Need Help?

If your images aren't showing up:
1. Check file names exactly match (case-sensitive)
2. Make sure files are in `/public/` folder
3. Clear browser cache (Ctrl+Shift+R)
4. Restart dev server (`npm run dev`)
5. Check browser console for errors (F12)

---

**Last Updated:** October 26, 2025
**Status:** ✅ Ready to implement
