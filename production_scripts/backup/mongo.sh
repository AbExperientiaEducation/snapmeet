#!/bin/bash

MONGODUMP_PATH="/usr/bin/mongodump"
MONGO_HOST="127.0.0.1"
MONGO_PORT="27017"
MONGO_DATABASE="test"
MONGO_USERNAME="meetgun"
MONGO_PASSWORD="REPLACE_FROM_ENV"

TIMESTAMP=`date +%F-%H%M`
# Store the current date in YYYY-mm-DD-HHMMSS
DATE=$(date -u "+%F-%H%M%S")
# Get current directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo $DIR
FILE_NAME="backup-$DATE"
ARCHIVE_NAME="$FILE_NAME.tar.gz"
S3_BUCKET_NAME="snapmeet-db-backup-production"
S3_BUCKET_PATH="mongodb-backups"

# Create backup
$MONGODUMP_PATH -u $MONGO_USERNAME -p $MONGO_PASSWORD -h $MONGO_HOST:$MONGO_PORT -d $MONGO_DATABASE --out $DIR/backup/$FILE_NAME
# Compress backup
tar -C $DIR/backup/ -zcvf $DIR/backup/$ARCHIVE_NAME $FILE_NAME/
# Remove the backup directory
rm -r $DIR/backup/$FILE_NAME

# Upload to S3
s3cmd put $DIR/backup/$ARCHIVE_NAME s3://$S3_BUCKET_NAME/$S3_BUCKET_PATH/$ARCHIVE_NAME
