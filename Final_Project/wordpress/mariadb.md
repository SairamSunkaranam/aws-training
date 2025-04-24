# This document shows how to create the maria db. Please follow below steps to create and connect to the db 

1. Login into AWS RDS Console
2. Click on Create database
3. Choose Standard Create
4. Select "MariaDB" under Engine Options

<img width="1197" alt="image" src="https://github.com/user-attachments/assets/ce3fb1e2-2d1f-411f-ac69-d5b44786b283" />


5. Leave the Engine Version as it is. 
6. Choose "Free Tier" under Templates. If you choose anything else, it will cost you. 
7. Under settings:
    7.1 Give a Name to database. Like "mariadb-server"
    7.2 Under credential Settings:
        7.2.1 Leave the master user name as "admin"
        7.2.2 Choose "Self Managed" in Credentials Management
        7.2.3 Provide a strong password for the database server. The password shouldn't include symbols like / ' " @
        7.2.4 Provide the same password to confirm it. 

<img width="1203" alt="image" src="https://github.com/user-attachments/assets/101f20b6-231f-43b2-9f9c-c1f7f05866ac" />

8. Leave everything as it is in Instance configuration. 
    8.1 Just make sure the instance type must be either db.t2.micro, db.t3.micro or db.t4g.micro.
9. The storage is configured with 20GiB by default. Leave as it is. 
    9.1 Click on "Additional storage configuration" and uncheck the "Enable sotrage autoscaling"

<img width="1188" alt="image" src="https://github.com/user-attachments/assets/ad929c7d-ca79-4381-80cc-5ccb9be79576" />

10. As this is free tier, you won't be having a chance to do a multi-az deployment
11. Under Connectivity:
    11.1 Choose "Don't connect to an EC2 compute Resource"
    11.2 Choose "IPv4" for network type
    11.3 Select the VPC. For now, it should be "Default VPC"
    11.4 Under Subnet, you can leave it with "default". This will create a subnet group for you with the available subnets present under your VPC. 
        Or else, you can create the subnet group by limiting the specific subnets we want. 
    11.5 Select "Yes" for Public Access. 
    11.6 Select "Create new" for Security Group. Give a name to security group as "mariadb-security-group"
    11.7 Leave remaining configuration as it is.

<img width="1193" alt="image" src="https://github.com/user-attachments/assets/0fdf4daa-eb22-4098-88f8-2719c8fe3e1c" />

<img width="1193" alt="image" src="https://github.com/user-attachments/assets/efe221a5-1640-4e53-9067-abe3756e9218" />


12. You can skip the Tags section for now.
13. Make sure "password authentication" is enabled under Database Authentication. 
14. Monitoring is defaulted to "Database Insights - Standard" as it is Free tier. 
    14.1 Check the box on "Error log" under log exports. 
    14.2 Leave remaining as it is. 

<img width="1191" alt="image" src="https://github.com/user-attachments/assets/9714fc13-e697-49ca-b09c-bdf52145752d" />


15. Leave everything as it is in Additional Configruation. 
16. Click on Create Database. 


# Connecting to the database

# Download the SQL workbench according to your OS from the link - https://dev.mysql.com/downloads/workbench/

# Open the SQL Workbenach
# Click on the " + " Symbol on the home page in "MySQL Connections"


<img width="1010" alt="image" src="https://github.com/user-attachments/assets/617c68e8-13db-451c-af00-7395fca5545a" />


#It will open a pop up for "Set Up a new Connection". Provide the below details:
1. Provide the connection name as "MariaDB server"
2. Connection method as "Standard (TCP/IP)
3. For hostname, wait till the AWS RDS DB is created. Once the db is created, click on the databases section on the left side menu in RDS console. 
    3.1 Click on the "mariadb-server" on the databases. 
    3.2 Copy the "Endpoint" under "Connectivity & Security"
    3.3 Paste the endpoint under hostname in workbench. 

<img width="1413" alt="image" src="https://github.com/user-attachments/assets/718eadcd-df57-4a05-bab0-4fa4bc7cedc8" />

4. Leave the port as it is. 
5. change the username as "admin". (This is configured during creation of the database)
6. Leave as it is and click on "OK".


<img width="798" alt="image" src="https://github.com/user-attachments/assets/a5719cc9-c0a1-40f2-aaaf-78541aa19928" />

7. Now you will be see a new connection under "MySQL Connections" with the name "MariaDB sever"
8. Click on the connection. 

<img width="1018" alt="image" src="https://github.com/user-attachments/assets/2f4d0cd6-27b9-4ccc-bc53-ebbcc914cfe8" />

9. Provide the password that you have configured during the RDS DB creation.
10. Click on "Continue Anyway" if any warning popsup. 

<img width="1009" alt="image" src="https://github.com/user-attachments/assets/b1707c78-1dd8-43de-a0be-769fe7cf059e" />



11. Once authenticated you will be presented with a screen like this. 

![image](https://github.com/user-attachments/assets/484c7a69-f687-469b-8da1-f25b9277a18c)


12. Click on "Schemas" tab to see the available databases in your server. 
13. By default, you will be given with a query tab. otherwise, click on new SQL query tab.  
14. Copy paste the below commands and execute it. 


CREATE DATABASE a4lwordpress;
CREATE USER a4lwordpress IDENTIFIED BY a4lwordpress;
GRANT ALL ON a4lwordpress.* TO a4lwordpress;
FLUSH PRIVILEGES;

<img width="812" alt="image" src="https://github.com/user-attachments/assets/78509642-bd8b-44ea-9df7-28903604e126" />


