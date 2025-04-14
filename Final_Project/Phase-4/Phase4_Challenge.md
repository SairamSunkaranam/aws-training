🚀 Phase 4: Migrate to RDS + Use Secrets Manager + Connect EC2

🧩 What We’re Achieving

    ✅ Migrate from SQLite to RDS	Persistent, scalable DB
    ✅ Use Secrets Manager	Secure credentials
    ✅ Connect EC2 → RDS	App talks to real DB securely


✅ STEP-BY-STEP GUIDE

    1️⃣ Migrate Database from SQLite to RDS (PostgreSQL/MySQL)

        📌 We’ll use PostgreSQL here, but you can use MySQL too.

        a. Create an RDS PostgreSQL Instance

        Go to RDS → Create Database
        
        Choose:

            Engine: PostgreSQL
            Template: Free tier

        Settings:

            DB Instance Identifier: miniblog-db
            Master username: admin
            Master password: generate one or use placeholder

        Connectivity:

            VPC: Use the same VPC as EC2
            Subnet group: Select private subnets
            Public access: No
            VPC Security Group: Add one that allows PostgreSQL (port 5432) from your EC2 instances

        b. Create the Schema in RDS

            You’ll need a DB client (e.g., pgAdmin, DBeaver, or psql) to connect and run this:

                CREATE TABLE posts (
                    id SERIAL PRIMARY KEY,
                    title TEXT,
                    content TEXT
                );

            You can also script this from the app or a migration script.

    2️⃣ Store RDS Master Credentials in AWS Secrets Manager

        Go to Secrets Manager → Store a new secret

        Secret type: Credentials for RDS database

        Username: admin
        Password: your-password

        Select your RDS instance

        Name your secret: miniblog/db-credentials
        Enable automatic rotation (optional, but recommended)

    3️⃣ Update Flask App to Use RDS Instead of SQLite

        a. Install PostgreSQL Driver

        On EC2:

            pip3 install psycopg2-binary

        b. Update app.py

            Replace your SQLite logic with PostgreSQL logic:

                import psycopg2
                import boto3
                import json

                def get_db_connection():
                    secret_name = "miniblog/db-credentials"
                    region_name = "your-region"

                    # Fetch secret from Secrets Manager
                    session = boto3.session.Session()
                    client = session.client('secretsmanager', region_name=region_name)
                    secret = json.loads(client.get_secret_value(SecretId=secret_name)['SecretString'])

                    conn = psycopg2.connect(
                        host="your-rds-endpoint.rds.amazonaws.com",
                        dbname="postgres",
                        user=secret['username'],
                        password=secret['password'],
                        port=5432
                    )
                    return conn

            Then update your SQL queries to use this conn instead of SQLite.

            Example:

                @app.route('/')
                def index():
                    conn = get_db_connection()
                    cur = conn.cursor()
                    cur.execute("SELECT id, title FROM posts ORDER BY id DESC")
                    posts = cur.fetchall()
                    cur.close()
                    conn.close()
                    return render_template('index.html', posts=posts)

    4️⃣ Configure EC2 to Access Secrets Manager & RDS

        a. Attach IAM Role to EC2

            Go to IAM > Roles > Create Role

            Use EC2 as trusted entity
            Add SecretsManagerReadWrite policy
            (Optional) Add inline policy to restrict to just miniblog/db-credentials

            Attach this role to your EC2 instance

        b. Make Sure EC2 Can Access RDS

        EC2 and RDS must be in same VPC

        Security group for RDS must allow:
            
            Inbound TCP 5432 from EC2 security group

    5️⃣ Test the Connection

        Restart Flask app (systemctl or rerun)

        Visit your app → Add posts

        Check RDS → Posts should be stored

✅ BONUS: Cleanup SQLite References

    Delete blog.db
    Remove SQLite-related code

📦 Summary of Resources


    RDS	Stores app data
    Secrets Manager	Secures DB credentials
    IAM Role	Grants EC2 access to secrets
    Security Groups	Allow EC2 ↔ RDS
    psycopg2	PostgreSQL driver for Python
