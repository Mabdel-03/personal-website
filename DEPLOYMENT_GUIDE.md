# GitHub Pages Deployment Guide

## 📋 Step-by-Step Instructions

### Step 1: Create GitHub Repository

1. **Go to GitHub**: Visit [github.com](https://github.com) and sign in to your account
   - If you don't have an account, create one at github.com/join

2. **Create New Repository**:
   - Click the green "New" button (or the "+" icon in top right)
   - Repository name: `personal-website` (or `mahmoud-abdelmoneum`)
   - Description: "Personal academic website - MIT researcher in EECS, Brain & Cognitive Science, Chemistry, and Biology"
   - Make sure it's set to **Public**
   - ✅ Check "Add a README file"
   - Click "Create repository"

### Step 2: Upload Your Website Files

**Method 1: Web Interface (Easiest)**
1. In your new repository, click "uploading an existing file"
2. Drag and drop these files from your Personal_Website folder:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `profile-photo.jpg`
3. Scroll down to "Commit changes"
4. Title: "Add personal website files"
5. Click "Commit changes"

**Method 2: Git Command Line (Advanced)**
```bash
git clone https://github.com/yourusername/personal-website.git
cd personal-website
# Copy your files here
git add .
git commit -m "Add personal website files"
git push origin main
```

### Step 3: Enable GitHub Pages

1. **Go to Settings**:
   - In your repository, click the "Settings" tab
   - Scroll down to find "Pages" in the left sidebar

2. **Configure Pages**:
   - Source: Select "Deploy from a branch"
   - Branch: Select "main" (or "master")
   - Folder: Leave as "/ (root)"
   - Click "Save"

3. **Wait for Deployment**:
   - GitHub will show a message: "Your site is ready to be published"
   - It may take 5-10 minutes for the site to go live

### Step 4: Access Your Website

Your website will be available at:
```
https://yourusername.github.io/personal-website
```

Replace `yourusername` with your actual GitHub username.

### Step 5: Test Your Site

1. Visit your URL
2. Check that all sections work:
   - Navigation menu
   - Profile photo displays
   - Links work (CV, LinkedIn, GitHub)
   - Mobile responsiveness

## 🔧 Making Updates

To update your website:
1. Edit files directly in GitHub (click the pencil icon)
2. Or upload new versions of files
3. Changes will automatically deploy in a few minutes

## 🌐 Custom Domain (Optional)

If you want to use a custom domain like `mahmoudabdelmoneum.com`:

1. **Buy a domain** from Namecheap, Google Domains, etc.
2. **In GitHub repository Settings → Pages**:
   - Add your custom domain in the "Custom domain" field
   - Save changes
3. **Configure DNS** at your domain provider:
   - Add CNAME record pointing to `yourusername.github.io`

## 🚨 Troubleshooting

**Site not loading?**
- Wait 10-15 minutes after enabling Pages
- Check that repository is public
- Ensure `index.html` is in the root directory

**Images not showing?**
- Make sure `profile-photo.jpg` is uploaded
- Check file name matches exactly (case-sensitive)

**CSS not applying?**
- Verify `styles.css` is in the same directory as `index.html`
- Check browser console for errors (F12)

## 📈 Next Steps

1. **Share your URL** with colleagues and on your CV
2. **Add Google Analytics** for visitor tracking
3. **Consider a custom domain** for professional branding
4. **Keep content updated** as your research progresses

## 📞 Need Help?

If you encounter issues:
1. Check GitHub's Pages documentation
2. Verify all files are uploaded correctly
3. Ensure repository is public
4. Wait sufficient time for deployment

Your professional academic website will be live and accessible worldwide!
