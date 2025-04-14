🚀 Phase 2: Serve Static Content from S3 via CloudFront

🧩 Objective

    Move all static files (/static/) to S3 bucket
    Replace static URLs in the Flask app to load from CloudFront CDN
    Configure CloudFront for performance, caching, and security


✅ STEP-BY-STEP INSTRUCTIONS

    🎯 1. Identify Static Content in Your Flask App

        From your app structure:

            miniblog/
            │
            ├── static/
            │   ├── style.css
            │   └── images/
            │       └── logo.png

        We will upload everything inside /static to S3, and access via CloudFront.

    🪣 2. Create an S3 Bucket for Static Content

        Go to S3 > Create Bucket:
            
            Name: miniblog-static-content-[your-unique-id]
            Region: Same as your app
            Uncheck Block all public access (temporarily)
            Enable Bucket versioning (recommended)
            Upload your static files:
            Upload the style.css and images/ folder into this bucket.


    🔐 3. Set Bucket Policy to Allow Public Read (or Use OAI)

        For testing, you can set this public-read policy:

            {
            "Version": "2012-10-17",
            "Statement": [{
                "Sid": "PublicReadGetObject",
                "Effect": "Allow",
                "Principal": "*",
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::miniblog-static-content-*/static/*"
            }]
            }

        🔒 For production, you'll use CloudFront Origin Access Control (OAC) instead of making the bucket public.

    🧭 4. Create a CloudFront Distribution

        Go to CloudFront > Create Distribution:
            
            Origin Settings
            Origin domain: Select your S3 bucket
            Origin access: Use Origin Access Control (OAC)
            Create new OAC if needed
            Default cache behavior
            Viewer protocol policy: Redirect HTTP to HTTPS
            Allowed HTTP methods: GET, HEAD
            Cached HTTP methods: GET, HEAD
            Settings
            Alternate domain (optional): e.g., static.miniblog.com
            Price class: Use default (or regional if cost-sensitive)

        Create the Distribution

        ⚠️ It can take 5–15 minutes to deploy.

    📝 5. Update Flask App to Use CDN URLs

        In your base.html or wherever static assets are referenced:

        Original:

            <link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}">
            <img src="{{ url_for('static', filename='images/logo.png') }}">

        Updated:

            <link rel="stylesheet" href="https://[your-cloudfront-domain]/static/style.css">
            <img src="https://[your-cloudfront-domain]/static/images/logo.png">

        You can store the CloudFront domain in an environment variable or a config file for flexibility.

    🔁 6. Deploy and Test

        Restart Flask app (optional if code changed)
        
        Visit the app through ALB
        Check browser DevTools → Static assets should load from CloudFront

✅ BONUS: Make it Dynamic with Jinja
    
    To avoid hardcoding CloudFront URLs, you can pass it via config:

    In app.py:

        app.config['CDN_URL'] = 'https://[your-cloudfront-domain]/static/'

    In template:

        <link rel="stylesheet" href="{{ config['CDN_URL'] }}style.css">


🧼 OPTIONAL: Clean up Flask static/ folder

    Once static assets are moved, remove them from the static/ directory (or at least stop serving them via Flask).

📦 Summary of Phase 2

    S3 Bucket	Hosts static files
    CloudFront CDN	Delivers assets globally
    Flask Templates	Updated to use CDN
    Security	Optionally use OAC instead of public access
