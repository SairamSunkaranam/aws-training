cd /var/www/html/wp-content/plugins

wget https://downloads.wordpress.org/plugin/amazon-s3-and-cloudfront.latest-stable.zip

unzip amazon-s3-and-cloudfront.latest-stable.zip

sudo chown -R apache:apache amazon-s3-and-cloudfront/

sudo yum install awscli -y

aws configure set aws_access_key_id ''
aws configure set aws_secret_access_key ''
aws configure set region ap-south-1
aws configure set output text

sudo yum install cronie -y
sudo systemctl enable crond.service
sudo systemctl start crond.service

curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
chmod +x wp-cli.phar
sudo mv wp-cli.phar /usr/local/bin/wp

sudo chown -R apache:apache /var/www/html
sudo find /var/www/html -type d -exec chmod 755 {} \;
sudo find /var/www/html -type f -exec chmod 644 {} \;
sudo systemctl restart httpd

sudo amazon-linux-extras enable php8.1
sudo yum clean metadata
sudo yum install php-gd -y
sudo systemctl restart httpd

(crontab -l 2>/dev/null; echo "*/5 * * * * /usr/bin/aws s3 sync s3://wordpress-s3-bucket-588738614244/wp-uploads/ /var/www/html/wp-content/uploads/ --exact-timestamps && cd /var/www/html && /usr/local/bin/wp media import wp-content/uploads/** --skip-copy --preserve-filetime --allow-root >> /var/log/media-sync.log 2>&1") | crontab -