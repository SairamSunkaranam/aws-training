🚀 Phase 6: Full Infrastructure with CloudFormation

🎯 What We’ll Accomplish

    1️⃣	Convert the full architecture into CloudFormation YAML templates
    2️⃣	Use Stacks to deploy the environment
    🔁	Future updates become version-controlled and repeatable

✅ Architecture Components to Include

    We’ll create modular templates (recommended for readability):

    vpc.yml – VPC, subnets, routes
    rds.yml – RDS instance + subnet group
    ecr.yml – ECR repo for container images
    ecs.yml – ECS cluster, task def, service
    alb.yml – ALB and target group
    secrets.yml – Secrets Manager secret
    main.yml – Master template to call all above via nested stacks

1️⃣ Set Up Project Structure

    Locally or in Git:

    cloudformation/
    │
    ├── main.yml
    ├── vpc.yml
    ├── rds.yml
    ├── ecs.yml
    ├── alb.yml
    ├── ecr.yml
    └── secrets.yml
    Each file will be a standalone CloudFormation template.

2️⃣ Template Examples
    
    Stored under CloudFormation Folder

3️⃣ main.yml – Master Template

    Stored under CloudFormation Folder 

4️⃣ Upload Templates to S3

    aws s3 mb s3://miniblog-cloudformation
    aws s3 cp . s3://miniblog-cloudformation/ --recursive

5️⃣ Create the Stack

    Use the master template:

    aws cloudformation create-stack \
    --stack-name miniblog-full-stack \
    --template-url https://s3.amazonaws.com/miniblog-cloudformation/main.yml \
    --capabilities CAPABILITY_NAMED_IAM

    Or use the AWS Console → CloudFormation → Upload main.yml from S3.

🔁 Update the Stack

    If you modify a template:

    aws cloudformation update-stack \
    --stack-name miniblog-full-stack \
    --template-url https://s3.amazonaws.com/miniblog-cloudformation/main.yml \
    --capabilities CAPABILITY_NAMED_IAM

✅ Recap: Phase 6 Deliverables

    VPC/Subnets	vpc.yml
    RDS	rds.yml
    ECS + Fargate	ecs.yml
    Secrets	secrets.yml
    Load Balancer	alb.yml
    Container Image	ecr.yml
    Master Orchestration	main.yml
