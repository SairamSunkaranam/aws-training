🚀 Phase 7: CI/CD Pipeline with SonarQube, Docker, ECR, and CloudFormation Deploy

✅ Goals Recap

You want to:

    ✅ Automatically trigger deployment on GitHub code changes
    ✅ Run SonarQube analysis
    ✅ Build a Docker image and upload it to ECR
    ✅ Deploy infrastructure using CloudFormation
    ✅ Manage all of this using CodePipeline via CloudFormation

🧱 Resources Created

    ECRRepository	Container image repository
    CodeBuildProject	Builds Docker, runs SonarQube, pushes to ECR
    CodePipeline	Manages the end-to-end workflow
    ArtifactBucket	Stores intermediate build artifacts
    CloudFormationExecutionRole	Allows CloudFormation deploy from pipeline
    CodePipelineServiceRole	Pipeline-wide permissions for CodeBuild, ECR, CFN

🪜 Step-by-Step Instructions

1️⃣ Prepare Your GitHub Repository

    Ensure the repo contains:

        /cloudformation/
        main.yml
        vpc.yml
        rds.yml
        alb.yml
        etc...
        /app/ (your Flask or Node app)
        /Dockerfile
        /buildspec.yml (not needed now; embedded in template)

2️⃣ Create the CloudFormation Stack for Pipeline
    
    Use the pipeline.yml CloudFormation template I provided earlier.

    a. Save it locally:

        vi pipeline.yml
        # (Paste the template here)

    b. Deploy the template via CLI:

        aws cloudformation deploy \
        --template-file pipeline.yml \
        --stack-name miniblog-cicd-pipeline \
        --capabilities CAPABILITY_NAMED_IAM \
        --parameter-overrides \
            GitHubOwner=my-username \
            GitHubRepo=my-repo \
            GitHubBranch=main \
            GitHubToken=ghp_yourGitHubToken \
            ECRRepoName=miniblog-app

    ✅ This creates everything: ECR, CodePipeline, CodeBuild project, IAM roles, and deploy logic.

3️⃣ Configure SonarQube (If Not Already)

    Ensure your app has a sonar-project.properties file, or configure via CLI:
        
        sonar-scanner \
        -Dsonar.projectKey=miniblog \
        -Dsonar.sources=. \
        -Dsonar.host.url=https://your-sonar-url \
        -Dsonar.login=your-token

    Update these values in the BuildSpec section of the CloudFormation template.

4️⃣ Validate ECR Access in Docker Push

    In buildspec, ensure the image is tagged and pushed correctly:

        docker build -t $ECR_REPO:latest .
        docker tag $ECR_REPO:latest <account>.dkr.ecr.<region>.amazonaws.com/$ECR_REPO:latest
        docker push <account>.dkr.ecr.<region>.amazonaws.com/$ECR_REPO:latest

    🔁 This is already done in the template, just update placeholders.

5️⃣ Watch Pipeline in Action

    Make a code change and push to GitHub

    Open AWS Console → CodePipeline → miniblog-cicd-pipeline

    Verify each stage:
        Source: GitHub → OK
        Build: SonarQube + Docker build + ECR push
        Deploy: CloudFormation stack (main.yml) updates
        Stack gets deployed with latest Docker image

6️⃣ (Optional) Add SNS Notifications

    If you want pipeline success/failure emails, add a final CodeBuild stage with this buildspec:

        version: 0.2
        phases:
        build:
            commands:
            - aws sns publish --topic-arn arn:aws:sns:region:account-id:miniblog-deploy-status \
                --message "✅ Deployment complete!" \
                --subject "Miniblog Pipeline Succeeded"

        Or configure a CloudWatch Event Rule on CodePipeline Pipeline Execution State Change.

🧪 Tips for Testing

    Make a simple HTML or Python code change → Commit + push
    Use docker pull to verify image got pushed to ECR
    Check SonarQube UI for scan results
    Review CloudFormation → Stacks for updated resources
✅ Summary

    1️⃣	GitHub push triggers pipeline
    2️⃣	SonarQube analysis checks code quality
    3️⃣	Docker image built and uploaded to ECR
    4️⃣	CloudFormation deploys/updates infrastructure
    5️⃣	Optional SNS/Slack notifications on result
