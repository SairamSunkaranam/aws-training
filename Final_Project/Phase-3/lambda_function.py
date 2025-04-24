import boto3
import json
import time

BUCKET = 'wordpress-s3-bucket-<your-account-number>'
PREFIX = 'wp-uploads/'

s3 = boto3.client('s3')

def lambda_handler(event, context):

    print("Start sleep")
    time.sleep(20)
    print("End sleep")


    response = s3.list_objects_v2(Bucket=BUCKET, Prefix=PREFIX)
    keys = [obj['Key'].replace(PREFIX, '') for obj in response.get('Contents', []) if obj['Key'].lower().endswith(('.jpg', '.jpeg', '.png'))]

    image_list = {
        "images": keys
    }

    s3.put_object(
        Bucket=BUCKET,
        Key=f"{PREFIX}image-list.json",
        Body=json.dumps(image_list),
        ContentType='application/json',
        ACL='public-read'
    )

    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'image-list.json updated'})
    }
