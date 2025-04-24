🚀 Phase 4: Migrate to RDS + Use Secrets Manager + Connect EC2

🧩 What We’re Achieving

    ✅ Migrate from SQLite to RDS	Persistent, scalable DB
    ✅ Use Secrets Manager	Secure credentials
    ✅ Connect EC2 → RDS	App talks to real DB securely


✅ STEP-BY-STEP GUIDE

    1️⃣ Migrate Database from Local to RDS (mariadb)

        📌 We’ll use Mariadb here.

        Create the database using the instructions in mariadb.md.

    2️⃣ Store RDS Master Credentials in AWS Secrets Manager (Optional)

        Modify your database to use secret manager. 
        
        Select the database that you have created and click on modify. 

        Under credentials management:
            Leave the master user name as it is. 
            Select the Secret Manager to store the password.
            Provide a name to the secret and create it. 
            Uncheck Auto Rotate option.
            Come down to save the changes and click on apply it immdiately.

        Now your password is stored in Secrets Manager.

    3️⃣  Test the Connection

        Restart httpd using below command:

            systemctl restart httpd

        Now, access your wordpress application and it should work as expected. 

📦 Summary of Resources


    RDS	Stores app data
    Secrets Manager	Secures DB credentials
    Security Groups	Allow EC2 ↔ RDS
