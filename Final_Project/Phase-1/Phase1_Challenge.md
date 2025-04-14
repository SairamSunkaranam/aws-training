🚀 Phase 1: Deploy MiniBlog on EC2 in Private Subnets with ASG & Load Balancer

🗂️ Overview of What We'll Build

    VPC with 2 public and 2 private subnets (across 2 AZs)
    EC2 Instances (Flask app) in private subnets
    Application Load Balancer (ALB) in public subnets
    Auto Scaling Group (ASG) behind ALB
    Launch Template with user-data to install & run the Flask app
    CloudWatch Alarm to scale based on CPU



✅ STEP-BY-STEP SETUP Instructions

    🔧 1. Create the VPC & Subnets:

        You can use AWS VPC Wizard or do this manually.

        Go to VPC Dashboard > Create VPC
        
        Name: MiniBlogVPC
        CIDR: 10.0.0.0/16

        Create 2 public subnets:    

            Example: 10.0.1.0/24 and 10.0.2.0/24
            Enable auto-assign public IP

        Create 2 private subnets:

            Example: 10.0.3.0/24 and 10.0.4.0/24
            Create Internet Gateway and attach it to VPC

        Route Table setup:

            Public Subnet → Route to Internet Gateway
            Private Subnet → NAT Gateway or instance (if needed for outbound internet access)

    ⚙️ 2. Create Security Groups

        ALB SG (Public-facing):

            Inbound: HTTP (80) from anywhere
            Outbound: All traffic

        EC2 SG (Private instances):

            Inbound: HTTP (80) from ALB SG
            Outbound: All traffic

    📦 3. Create a Launch Template

        Go to EC2 > Launch Templates > Create Launch Template

        Template Settings:
            AMI: Amazon Linux 2
            Instance Type: t2.micro (for test)
            Key pair: (Optional)
            Network: Leave default
            Security Group: EC2 SG
            IAM Role: (Optional, if using S3 or logs)

        📜 User Data Script (paste into "Advanced Details"):

            #!/bin/bash
            yum update -y
            yum install python3 git -y
            pip3 install flask

            # Clone the repo or use a zip with your code
            cd /home/ec2-user
            git clone https://github.com/yourusername/miniblog.git
            cd miniblog

            # Run app (basic example — you may want to daemonize or use gunicorn + systemd)
            nohup python3 app.py --host=0.0.0.0 &
            🔁 Replace the git clone URL with your repo OR use aws s3 cp if you zip the code and upload to S3.


    ⚖️ 4. Create Target Group

        Go to EC2 > Target Groups > Create Target Group:

            Type: Instance
            Protocol: HTTP (port 80)
            VPC: MiniBlogVPC
            Health check path: /

    🌐 5. Create Application Load Balancer (ALB)
    
        Go to EC2 > Load Balancers > Create ALB:

            Scheme: Internet-facing
            Type: Application Load Balancer
            Listeners: HTTP 80
            AZs: Use 2 public subnets
            Security Group: ALB SG

        Forwarding Rules:

            Forward HTTP → Target Group created above

    🧱 6. Create Auto Scaling Group (ASG)

        Go to EC2 > Auto Scaling Groups > Create:

            Launch Template: Use the one we created
            VPC: MiniBlogVPC
            Subnets: Select private subnets
            Target Group: Attach to the ALB's Target Group
            Min/Max/Desired: e.g., 1/4/1

    📈 7. Auto Scaling Policy (CPU Based)

        In ASG settings:

            Choose Target Tracking Scaling Policy
            Policy: Add if average CPU > 50%
            Cooldown: 300 seconds
            Optionally: Add a scale-in policy too

    🧪 8. Test Everything

        Visit ALB DNS name (public) in browser — it should load the MiniBlog app.
        Try creating a post and see if it persists.
        Simulate load with stress or similar to test scaling.

✅ Summary of Resources Created

    VPC	Isolated network
    Public/Private Subnets	Network segmentation
    ALB	Expose app to internet
    EC2 SG	Controls access to app
    Launch Template	Automate EC2 setup
    ASG	Automatically manage EC2 fleet
    CPU Policy	Auto scale based on usage
