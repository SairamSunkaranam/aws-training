# Step 1: Create a Git Connection in AWS Developer Tools for the cicd-devops Repository
    
    Navigate to AWS Developer Tools:

        Go to the AWS Management Console.
        In the search bar, type "Code Commit" and Go to the "Settings" on the same page.
        This is where you will create a Git connection (e.g., GitHub, GitLab, Bitbucket).

    Create a Connection to GitHub:

        Click on Create connection.
        Choose GitHub as the connection type.
        Click on Connect to GitHub.
        Authorize AWS to access your GitHub account (you will need to authenticate with your GitHub credentials).
        Choose the <cicd-devops> repository when prompted.
        Once connected, AWS will display the status of the connection.
        Ensure the connection is successful and active.
        You can also check this in GitHub, by navigating to applications under settings.

# Step 2: Create a CodeBuild Project with Specified Environment Settings

    Navigate to AWS CodeBuild:

        Go to the AWS Management Console and search for "CodeBuild".
        Select CodeBuild from the results.

        Create a New CodeBuild Project:

            Click on Create build project.
            
            Set Up Project Configuration:

                Project name: Enter a meaningful name (e.g., cicd-devops-build).
                Source: Choose GitHub and select the cicd-devops repository from the list (this will be the source repository).
                
                Environment:

                    ...

                Service role: Create a new role or choose an existing role with sufficient permissions.

                Buildspec File:
                    
                    Buildspec: Choose Use a buildspec file and make sure it points to the buildspec.yaml file in the repository (it will be automatically detected if placed in the root directory).

                Artifacts:

                    For Artifacts, select No artifacts (or configure output artifact if needed).

            Save the Project:

                Review the configuration and click Create build project.

# Step 3: Create a Pipeline with Multiple Stages

    Navigate to AWS CodePipeline:

        Go to the AWS Management Console and search for CodePipeline.
        Select CodePipeline from the results.

    Create a New Pipeline:

        Click on Create pipeline.

    Pipeline Configuration:
        
        Pipeline name: Enter a name for your pipeline (e.g., cicd-devops-pipeline).
        Service role: Either create a new service role or select an existing one.
        Artifact store: Choose Default location (S3).

    Source Stage Configuration: 
        
        Source provider: Select GitHub and choose the cicd-devops repository.
        Set up GitHub webhook to trigger on push or pull requests.
        Branch: Choose the branch that triggers the pipeline (e.g., main or develop).

    Create the ECR Repository (CloudFormation Stage):
    
        Action category: Choose Deploy.
        Provider: Select CloudFormation.
        Action name: Enter a name like CreateECRRepo.
        Template: Provide the path to your CloudFormation template in the source code repository that defines the ECR repository creation.
        Stack name: Provide a stack name (e.g., ecr-stack).
        Parameters: Pass any parameters required by the template, including the name of the ECR repository (this will be passed to the next stage).
        Output artifacts: Specify that the ECR repository name will be passed as an artifact to the next stage (e.g., ECRRepoName).

    Add CodeBuild Stage (Build Stage):

        Action category: Choose Build.
        Provider: Select CodeBuild.
        Action name: Enter a name like BuildApp.
        Project name: Select the CodeBuild project you created earlier (cicd-devops-build).
        Input artifacts: Choose the output artifact from the previous stage (e.g., source code).
        Output artifacts: Choose or leave empty if you don’t need additional artifacts from the build.

    Add CloudFormation Stage (ECS Infrastructure Creation):

        Action category: Choose Deploy.
        Provider: Select CloudFormation.
        Action name: Enter a name like CreateECSInfrastructure.
        Template: Provide the path to your CloudFormation template that will create the ECS Cluster, Service, Task Definition, Load Balancer, and Target Group.
        Stack name: Provide a stack name (e.g., ecs-stack).
        Parameters: Pass any parameters required, including the ECR repository name from the previous stage.

    Add ECS Deployment Stage:

        Action category: Choose Deploy.
        Provider: Select Amazon ECS.
        Action name: Enter a name like DeployToECS.
        Cluster name: Provide the ECS cluster name.
        Service name: Specify the ECS service name.
        Input artifacts: Choose the output artifact from the previous build stage.

    Review and Create the Pipeline:
        Review all stages and settings.
        Once satisfied, click Create pipeline.
