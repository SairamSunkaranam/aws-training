📸 Use Case: create image-list.json file to be loaded from the 

Scenario:

    Users will be able to view the pictures uploaded for the website. Once uploaded:

        The image is placed in a wp-uploads/ folder in the S3 bucket.
        An event is triggered and executes the Lambda function.
        The Lambda function creates image-list.json with the available pictures on the wp-uplods/ folder.

        This file will be used by Java Script file to load all the images.

✅ Step-by-Step Setup: S3 + Lambda for Image Processing


    📦 1. Create an Lambda function 
        
        Name: wordpress-lambda-function
        Runtime -> Python 3.9
        Architecture: x86_64
        Execution Role: Choose to Create new role with the necessary permissions
        Create Lambda function. 
        Once the Lambda function is created, go to the role create and attach S3FullAccess policy to it. 

    📬 2. Add the source code to the Lambda:

        Go to the source section and Copy/Paste the code in lambda_function.py into the code area. 
        Make sure to replace the bucket name in the code. 
        Click on Deploy. 
    
    🧪 3. Create Trigger to S3 Bucket:

        Click Trigger -> Add Trigger -> Select Source as S3. 

        In the next windows 

        Select the bucket -> Event types -> Select "PUT"

        please provide suffix as "wp-uploads"

        suffix as ".jpg"

    🧪 3. Test Lambda to create the image-list.json file:

        Now add an image into wp-uploads/ folder in you bucekt. It must trigger the Lambda and should create a file named image-list.json.


📦 Summary

    S3	Store the images
    Lambda	Generate image-list.json file for HTML to work
    IAM Role Grants Lambda access to S3 
