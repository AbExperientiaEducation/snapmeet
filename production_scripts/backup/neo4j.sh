#!/bin/bash

NEO4J_BACKUP_PATH="/usr/bin/neo4j-backup"
NEO4J_HOST="127.0.0.1"

TIMESTAMP=`date +%F-%H%M`
# Store the current date in YYYY-mm-DD-HHMMSS
DATE=$(date -u "+%F-%H%M%S")
# Get current directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo $DIR
FILE_NAME="neo4j-backup-$DATE"
ARCHIVE_NAME="$FILE_NAME.tar.gz"
S3_BUCKET_NAME="snapmeet-db-backup-production"
S3_BUCKET_PATH="neo4j-backups"

# Create backup
$NEO4J_BACKUP_PATH -to $DIR/backup/$FILE_NAME -host 127.0.0.1
# Compress backup
tar -C $DIR/backup/ -zcvf $DIR/backup/$ARCHIVE_NAME $FILE_NAME/
# Remove the backup directory
rm -r $DIR/backup/$FILE_NAME

# Upload to S3
s3cmd put $DIR/backup/$ARCHIVE_NAME s3://$S3_BUCKET_NAME/$S3_BUCKET_PATH/$ARCHIVE_NAME
