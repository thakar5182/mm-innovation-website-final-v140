M&M Innovation Website FINAL V1.4.0
================================

HOW TO RUN
1. Extract the ZIP into a NEW empty folder. Do not merge it with an older version.
2. Double-click START-WEBSITE.bat.
3. The launcher automatically selects a free port and opens the correct URL.
4. Keep the black server window open while using the website.

MANUAL METHOD
Open PowerShell inside the folder containing index.html, then run exactly:
   py -m http.server 8080 --bind 127.0.0.1
Open:
   http://localhost:8080

If port 8080 is already busy, run:
   py -m http.server 8081 --bind 127.0.0.1
Then open:
   http://localhost:8081

WHAT IS INCLUDED
- Fully offline responsive multi-page industrial editorial website
- New transparent vector M&M Innovations logo in navigation, hero and footer
- Searchable catalogue with 50 manually structured product families
- 50 individually mapped, product-specific 1200x900 catalogue photographs
- Every card and its View Details modal use the exact same matching photograph
- Clean single-layer image cards with no brochure-page screenshots
- Purposeful scroll reveals, hover motion and reduced-motion support
- Updated contact details: +91 9879778389 and info@mminnovation.in only
- Five category filters and product detail modal
- PDF downloads and full brochure-page images intentionally removed
- Manufacturing capabilities, in-house machinery and industries pages
- Working enquiry form stored in browser localStorage
- Tested Admin Panel: enquiries, live content/photo CMS and additional products
- Accessible mobile navigation, product search/filter and keyboard-friendly modal

MAIN PAGES
- index.html: Home
- about.html: Company profile and quality
- products.html: Product catalogue
- services.html: Manufacturing capabilities
- industries.html: Industries served
- contact.html: Contact and enquiry
- admin.html: Existing local Admin Panel

ADMIN LOGIN
- Username: admin
- Password: MM@2026
- Local CMS data is stored in the same browser used to open the website.

DEPLOYMENT
The website is static and can be deployed directly to Vercel, Netlify, GitHub Pages
or any standard web host. Upload the complete extracted folder so all product images
and interactive catalogue features remain available.
