📸 Use Case: User Profile Photo Upload & Thumbnail Creation

Scenario:

    Users will be able to upload profile pictures to an S3 bucket. Once uploaded:

        The image is placed in a uploads/ prefix in the S3 bucket.
        An event is triggered and pushed to SQS.
        A Lambda function listens to the SQS queue, grabs the image, and:
        Validates the image (JPEG/PNG, size < 5MB)
        Creates a thumbnail (150x150) version
        Saves it to an thumbnails/ prefix in the same S3 bucket
        This can later be extended to face detection, watermarking, resizing, etc.

✅ Step-by-Step Setup: S3 + SQS + Lambda for Image Processing


    📦 1. Create an S3 Bucket for Image Uploads
        
        Name: miniblog-user-images-[unique-id]
        Enable versioning (recommended)
        Enable event notifications (you’ll configure this later)

        Structure:

            s3://miniblog-user-images/
            ├── uploads/
            │   └── user123.jpg
            ├── thumbnails/
            │   └── user123_thumb.jpg

    📬 2. Create an SQS Queue

        Name: image-upload-queue
        Standard Queue (FIFO not needed unless order matters)

    🧪 3. Add S3 Event Notification to SQS

        Go to your S3 bucket → Properties → Event notifications

        Create new notification:

            Name: S3ToSQSNotification
            Event type: PUT (ObjectCreated)
            Prefix: uploads/
            Suffix: .jpg, .jpeg, .png
            Destination: SQS queue image-upload-queue

        This will trigger a message to SQS every time a new image is uploaded to uploads/.

    🧠 4. Create Lambda Function to Process Images

        Use Python 3.9+ runtime

        a. IAM Role for Lambda

        Create a role with these permissions:

            SQS: ReceiveMessage, DeleteMessage, GetQueueAttributes
            S3: GetObject, PutObject
            Logs: CreateLogGroup, CreateLogStream, PutLogEvents

        b. Lambda Code (Python)

            import boto3
            import os
            import json
            from PIL import Image
            from io import BytesIO

            s3 = boto3.client('s3')

            def lambda_handler(event, context):
                print("Event:", json.dumps(event))

                for record in event['Records']:
                    message = json.loads(record['body'])
                    s3_info = message['Records'][0]['s3']
                    
                    bucket = s3_info['bucket']['name']
                    key = s3_info['object']['key']
                    
                    if not key.lower().endswith(('.jpg', '.jpeg', '.png')):
                        print("Not a supported image file.")
                        continue

                    try:
                        # Get original image
                        response = s3.get_object(Bucket=bucket, Key=key)
                        img_data = response['Body'].read()

                        img = Image.open(BytesIO(img_data))
                        img.thumbnail((150, 150))

                        # Save thumbnail to memory
                        buffer = BytesIO()
                        img.save(buffer, format=img.format)
                        buffer.seek(0)

                        # Create new key
                        filename = os.path.basename(key)
                        thumb_key = f"thumbnails/{filename.split('.')[0]}_thumb.{filename.split('.')[-1]}"

                        # Upload thumbnail
                        s3.put_object(Bucket=bucket, Key=thumb_key, Body=buffer, ContentType=response['ContentType'])

                        print(f"Thumbnail saved to {thumb_key}")

                    except Exception as e:
                        print("Error processing image:", str(e))

    ⚙️ 5. Configure Lambda Trigger (SQS)

        Go to Lambda → Add trigger → Choose SQS

        Select image-upload-queue
        Set batch size (e.g. 1–5)

    🧪 6. Test the System

        Upload a JPG/PNG to:

            s3://miniblog-user-images/uploads/user-photo.jpg

        That should:

            Trigger S3 event → push message to SQS
            Lambda picks it → generates thumbnail

        Saves to:
            s3://miniblog-user-images/thumbnails/user-photo_thumb.jpg

    🧼 Optional Enhancements

        ✅ Restrict accepted file types & size in Lambda
        ✅ Add metrics/logs using CloudWatch
        ✅ Use SNS to notify users when processing is complete


    📦 Summary

        S3	Store original and processed images
        SQS	Decouple upload event from processing
        Lambda	Generate image thumbnails on upload
        IAM Role	Grants Lambda access to S3 & SQS
        Pillow	Python lib used to manipulate images
