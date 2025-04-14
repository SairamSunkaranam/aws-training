🚀 Phase 5: Dockerize App, Deploy to ECS with ECR, ALB, and Auto Scaling

🧩 What We’re Doing in Phase 5

    ✅ Dockerize app	Container-based deployment
    ✅ Upload to ECR	Store app image
    ✅ Use ECS Fargate	Scalable container hosting
    ✅ Use ALB	Route traffic to ECS
    ✅ Link to RDS	Use existing DB
    ✅ Cleanup EC2	Fully move off EC2

✅ STEP-BY-STEP GUIDE

    1️⃣ Dockerize Your Flask App

        a. Create a Dockerfile in your project root:

            # Base image
            FROM python:3.9-slim

            # Set environment
            WORKDIR /app

            # Copy app
            COPY . /app

            # Install dependencies
            RUN pip install --no-cache-dir flask psycopg2-binary boto3 pillow gunicorn

            # Set port and start command
            ENV PORT=5000
            CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]

        b. Build and test locally (optional):

            docker build -t miniblog-app .
            docker run -p 5000:5000 miniblog-app

    2️⃣ Push Docker Image to Amazon ECR

        a. Create an ECR repo

            aws ecr create-repository --repository-name miniblog-app

        b. Authenticate & push image:

            aws ecr get-login-password | docker login --username AWS --password-stdin [your-account-id].dkr.ecr.[region].amazonaws.com

        # Tag image
        docker tag miniblog-app:latest [your-account-id].dkr.ecr.[region].amazonaws.com/miniblog-app

        # Push
        docker push [your-account-id].dkr.ecr.[region].amazonaws.com/miniblog-app

    3️⃣ Create ECS Cluster and Fargate Service

        a. Go to ECS > Clusters > Create Cluster

            Type: Fargate
            Name: miniblog-cluster

        b. Create IAM Role for ECS Tasks

            Attach:

            AmazonECSTaskExecutionRolePolicy
            SecretsManagerReadWrite (for RDS creds)

        c. Create Task Definition

            Launch type: Fargate
            Container name: miniblog-container
            Image: your ECR image URI
            Port mappings: 5000
            Environment variables:

            Set RDS host, port, dbname, etc.
            Optionally pass the secret name for Secrets Manager

    4️⃣ Create an ALB for ECS

        a. Go to EC2 > Load Balancers > Application Load Balancer

            Name: miniblog-alb
            Scheme: Internet-facing
            Subnets: Use public subnets
            Security group: Allow HTTP (port 80)

        b. Target group for ECS

            Type: IP
            Port: 5000
            Protocol: HTTP

    5️⃣ Create ECS Service

        Go to ECS → Your Cluster → Create Service

        Launch Type: Fargate
        Task Definition: Select the one you created
        Service name: miniblog-service
        Desired count: 1

        Load Balancer:
        Type: Application Load Balancer

        Listener: port 80
        Target group: existing one

    6️⃣ Add Auto Scaling for ECS

        Go to ECS → Cluster → Services → Your service

        Click Auto Scaling
        Enable Target Tracking
        Metric: CPU Utilization
        Target value: 50%

    7️⃣ Update Flask App to Use RDS

        Since you're already using RDS + Secrets Manager in previous phases, make sure:

        The Task’s execution role can access Secrets Manager
        Flask connects to RDS using the existing logic from Phase 4

        ✅ If you're using environment variables (recommended), just modify the get_db_connection() in app.py to read values from os.environ.

    8️⃣ Cleanup EC2 Resources (Optional, but Recommended)

        Once ECS is working well:

            Terminate EC2 instance(s)
            Delete ASG, Launch Template, ALB (old)
            Clean up unused SGs and Route Table entries
            Clean old VPC if you created a new one for ECS

🔄 ECS Architecture Summary
        
    Internet
    ↓
    ALB (public subnet)
    ↓
    ECS Fargate Service (private subnets)
    ↓
    RDS (private subnet)
    ↑
    Secrets Manager (stores DB credentials)

📦 Summary of Phase 5

    Dockerfile	Containerized Flask app
    ECR	Hosts Docker images
    ECS Fargate	Runs containers
    ALB	Handles traffic
    Secrets Manager	Stores DB secrets
    RDS	Hosts app data
    Auto Scaling	Scales ECS service based on CPU
