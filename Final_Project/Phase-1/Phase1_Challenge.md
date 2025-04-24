🚀 Phase 1: Deploy Wordpress on EC2 in Private Subnets with ASG & Load Balancer

🗂️ Overview of What We'll Build

    VPC with 2 public subnets
    EC2 Instances (Wordpress app) in public subnets
    Application Load Balancer (ALB) in public subnets
    Auto Scaling Group (ASG) behind ALB
    Launch Template with user-data to install & run the Wordpress app
    CloudWatch Alarm to scale based on CPU



✅ STEP-BY-STEP SETUP Instructions

    🔧 1. Create the VPC & Subnets:

        You can use AWS VPC Wizard or do this manually.

        Go to VPC Dashboard > Create VPC
        
        Name: WordPressVPC
        CIDR: 10.0.0.0/16

        Create 2 public subnets:    

            Example: 10.0.1.0/24 and 10.0.2.0/24
            Enable auto-assign public IP

        Create 2 private subnets:

            Example: 10.0.3.0/24 and 10.0.4.0/24
        
        Create Internet Gateway and attach it to VPC

        Route Table setup:

            Public Subnet → Route to Internet Gateway

    ⚙️ 2. Create Security Groups

        ALB SG (Public-facing):

            Inbound: HTTP (80) from anywhere
            Outbound: All traffic

        EC2 SG (Public instances) and restricted from ALB:

            Inbound: HTTP (80) from ALB SG
            Outbound: All traffic

    📦 3. Create a Launch Template

        Go to EC2 > Launch Templates > Create Launch Template

        Template Settings:
            AMI: Amazon Linux 2
            Instance Type: t2.micro (for free tier)
            Key pair: (Optional)
            Network: Leave default
            Security Group: Select EC2 SG
            IAM Role: (Optional, if using S3 or logs)

        📜 User Data Script (paste into "Advanced Details"):

            #!/bin/bash -xe

            DBName='a4lwordpress'
            DBUser='a4lwordpress'
            DBPassword='4n1m4l$4L1f3'
            DBRootPassword='4n1m4l$4L1f3'

            dnf -y update

            dnf install wget php-mysqlnd httpd php-fpm php-mysqli mariadb105-server php-json php php-devel stress -y

            systemctl enable httpd
            systemctl enable mariadb
            systemctl start httpd
            systemctl start mariadb

            mysqladmin -u root password $DBRootPassword

            wget http://wordpress.org/latest.tar.gz -P /var/www/html
            cd /var/www/html
            tar -zxvf latest.tar.gz
            cp -rvf wordpress/* .
            rm -R wordpress
            rm latest.tar.gz

            sudo cp ./wp-config-sample.php ./wp-config.php
            sed -i "s/'database_name_here'/'$DBName'/g" wp-config.php
            sed -i "s/'username_here'/'$DBUser'/g" wp-config.php
            sed -i "s/'password_here'/'$DBPassword'/g" wp-config.php
            sed -i "s/'localhost'/'$DBEndpoint'/g" wp-config.php

            usermod -a -G apache ec2-user   
            chown -R ec2-user:apache /var/www
            chmod 2775 /var/www
            find /var/www -type d -exec chmod 2775 {} \;
            find /var/www -type f -exec chmod 0664 {} \;

            echo "CREATE DATABASE $DBName;" >> /tmp/db.setup
            echo "CREATE USER '$DBUser'@'localhost' IDENTIFIED BY '$DBPassword';" >> /tmp/db.setup
            echo "GRANT ALL ON $DBName.* TO '$DBUser'@'localhost';" >> /tmp/db.setup
            echo "FLUSH PRIVILEGES;" >> /tmp/db.setup
            mysql -u root --password=$DBRootPassword < /tmp/db.setup
            rm /tmp/db.setup


    ⚖️ 4. Create Target Group

        Go to EC2 > Target Groups > Create Target Group:

            Type: Instance
            Protocol: HTTP (port 80)
            Name: Wordpress-TG
            VPC: WordPressVPC
            Health check path: /
            Advacned Health Check Settings:
                Set the Success codes to 200-399s

    🌐 5. Create Application Load Balancer (ALB)
    
        Go to EC2 > Load Balancers > Create ALB:

            Type: Application Load Balancer
            Scheme: Internet-facing
            Name: wordpress-alb
            VPC: WordpressVPC
            AZs: Use 2 public subnets
            Listeners: HTTP 80
            Security Group: ALB SG

        Forwarding Rules:

            Forward HTTP → Target Group created above

    🧱 6. Create Auto Scaling Group (ASG)

        Go to EC2 > Auto Scaling Groups > Create:

            Name: wordpress-asg
            Launch Template: Use the one we created
            VPC: WordPressVPC
            Subnets: Select two public subnets
            LoadBalancing: Select existing load-balancer and choose wordpress-tg (target group)
            Min/Max/Desired: e.g., 1/4/1

    📈 7. Auto Scaling Policy (CPU Based)

        In ASG settings:

            Choose Target Tracking Scaling Policy
            Policy: Add if average CPU > 50%
            Cooldown: 300 seconds
            Optionally: Add a scale-in policy too

    🧪 8. Configure Wordpress

        Visit ALB DNS name (public) in browser — it should load the WordPress app. Install the wordpress with the details.
        Try creating a post and see if it persists.
        Simulate load with stress or similar to test scaling. (Optional)

✅ Summary of Resources Created

    VPC	Isolated network
    Public Subnets	Network segmentation
    ALB	Expose app to internet
    EC2 SG	Controls access to app
    Launch Template	Automate EC2 setup
    ASG	Automatically manage EC2 fleet
    CPU Policy	Auto scale based on usage
