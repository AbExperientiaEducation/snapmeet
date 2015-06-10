# Server configuration and ongoing deployment for Meetgun

We need:
- Nodejs
- Mongodb
- Neo4j
- Our code

Additional Dependencies:
- neo4j auth file
- aws pem file
- .env file
- SSL key and bundle
- .s3config file

All commands are on remote machine unless specified  
All copy commands are from the git repository root unless otherwise specified  

# Special Troubleshooting Section
## LOGS AND RESTARTS:
`sudo tail -f /var/log/nginx/access.log`
`sudo tail -f /var/log/nginx/error.log`
`sudo tail -f /var/log/mongodb/mongod.log`
`sudo tail -f /var/log/neo4j/neo4j.0.0.log`
`sudo tail -f /var/log/neo4j/http.log`
`sudo tail -f /var/log/meetgun/server.log`
`sudo tail -f /var/log/upstart/meetgun.log``

`sudo ./production_scripts/status.sh`
`sudo service nginx restart`
`sudo service neo4j-service restart`
`sudo service mongod restart`
`sudo restart meetgun`

# Pre-server setup
Locally: Create ssh config using the `pem` provided by ben/ian
1. Get the aws pem file from Ben or Ian (to be improved)
2. Now you can ssh in to the server: `ssh -A -i meetgun.pem ubuntu@ec2-52-24-226-103.us-west-2.compute.amazonaws.com`
3. Alternative method: add the following to `~/.ssh/config` and then you can connect to server via `ssh meetgun`
```
Host meetgun
  HostName ec2-52-24-226-103.us-west-2.compute.amazonaws.com
  User ubuntu
  IdentityFile "~/.ssh/meetgun.pem"
  ForwardAgent yes
```

# Server Setup
## Server Hardening
- Better passwords and secret file management

### AWS Console
Todo
- Security group

## Server Monitoring
Source: NewRelic
1. `echo "deb http://apt.newrelic.com/debian/ newrelic non-free" | sudo tee /etc/apt/sources.list.d/newrelic.list`
2. `wget -O- https://download.newrelic.com/548C16BF.gpg | sudo apt-key add -`
3. `sudo apt-get update`
4. `sudo apt-get install newrelic-sysmond`
5. !!!SPECIAL License Key is per server...: `sudo nrsysmond-config --set license_key=***REMOVED***`
6. `sudo /etc/init.d/newrelic-sysmond start`

## Node
Source: https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-an-ubuntu-14-04-server

1. `sudo apt-get update`
2. `sudo apt-get install build-essential libssl-dev`
3. `curl https://raw.githubusercontent.com/creationix/nvm/v0.16.1/install.sh | sh`
4. `source ~/.profile`
5. `nvm install 0.12.1`
6. `nvm alias default 0.12.1`
7. `nvm use default`

## MongoDB
Source: http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/

### Install
1. `sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10`
2. `echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list`
3. `sudo apt-get update`
4. `sudo apt-get install -y mongodb-org`

### Security
Note: Passwords for accounts are in `.env`
5. `sudo vi /etc/mongod.conf`
6. Uncomment line 28: auth = true
7. `sudo service mongod restart`
8. Run `mongo` client from command line.
9. `use admin`
10. `db.createUser({user:'admin', pwd:'REPLACE_FROM_ENV', roles: [{role:"userAdminAnyDatabase", db: "admin"}]})`
11. Exit from the mongo console
12. Create a new mongo console: `mongo -u admin -p REPLACE_FROM_ENV --authenticationDatabase admin`
13. `use test`
14. `db.createUser({user:'meetgun', pwd:'REPLACE_FROM_ENV', roles: [{role:"readWrite", db: "test"}]})`

To run: `sudo service mongod start`

## Neo4j
Source: http://debian.neo4j.org

1. `wget -O - http://debian.neo4j.org/neotechnology.gpg.key | sudo apt-key add -`
2. `sudo sh -c "echo 'deb http://debian.neo4j.org/repo stable/' > /etc/apt/sources.list.d/neo4j.list"`
3. `sudo apt-get update`
4. `sudo apt-get install neo4j-enterprise`

auth lives in: `/var/lib/neo4j/data/dbms/auth` and we want to copy our local version there from `/usr/local/Cellar/neo4j/2.2.0/libexec/data/dbms/auth`
6. On local machine: `scp /usr/local/Cellar/neo4j/2.2.0/libexec/data/dbms/auth ubuntu@meetgun:.`
7. On remote: `sudo mv auth /var/lib/neo4j/data/dbms/auth`
8. `sudo chown neo4j:nogroup /var/lib/neo4j/data/dbms/auth`

### Configuration
Source: http://neo4j.com/docs/stable/linux-performance-guide.html

1. `sudo vi /var/lib/neo4j/conf/logging.properties`
  - Change logging level to `FINE` for `.level` and `org.neo4j.server.level`
2. `sudo vi /var/lib/neo4j/conf/neo4j-server.properties`
  - Change `org.neo4j.server.http.log.enabled` to `true`
3. `sudo vi /etc/security/limits.conf`
  - Add these two lines:
    ```
    neo4j   soft    nofile  40000
    neo4j   hard    nofile  40000
    ```
4. `sudo vi /etc/pam.d/su`
  - Uncomment or add: 
    ```
    session    required   pam_limits.so
    ```

To restart server: `service neo4j-service [start, stop, restart]`

## Nginx
Source: https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-14-04
Alt Source: http://blog.argteam.com/coding/hardening-node-js-for-production-part-2-using-nginx-to-avoid-node-js-load/

1. `sudo apt-get install nginx`
2. `sudo mkdir /etc/nginx/ssl`
3. SSL Cert is in our secure share. Installation instructions are: https://support.comodo.com/index.php?/Knowledgebase/Article/View/789/0/certificate-installation-nginx
4. `sudo cp production_scripts/nginx/default.conf /etc/nginx/sites-available/default`
5. `sudo cp production_scripts/nginx/nginx.conf /etc/nginx/nginx.conf`

To restart server: `sudo service nginx [start, restart, stop, status]`

### Gotchas
1. If you change the nginx conf files, you must fully stop then start the nginx server.

## Our code
source: https://www.exratione.com/2013/02/nodejs-and-forever-as-a-service-simple-upstart-and-init-scripts-for-ubuntu/

1. `sudo apt-get install git`
2. `git clone git@bitbucket.org:igmcdowell/meetgun.git`
3. `npm install -g npm`
4. `npm install --global babel`
5. `npm install --global gulp`
7. `npm install -g igmcdowell/node-migrate`
8. `npm install -g npm-shrinkwrap`
9. `npm install`
10. `migrate`
11. `gulp build`
12. Copy the `.env` file from somewhere
13. `sudo mkdir /var/log/meetgun`
14. `sudo chown -R ubuntu:adm /var/log/meetgun`
15. `sudo crontab -e`
    - Set to restart the app server at 10 PM PST every day. We do this to avoid running out of memory.
    - eg `0 22 * * * /sbin/restart meetgun`

### To Run
1. `sudo cp production_scripts/upstart.conf /etc/init/meetgun.conf`
2. `sudo start meetgun`

### To update
1. `git pull`
2. `npm install`
3. `gulp build`
4. `sudo restart meetgun`

### Gotchas
1. If you change the `upstart` config itself, you must stop then start the jobs, not restart (source: http://askubuntu.com/questions/236803/upstart-conf-changes-do-not-reload-after-edit)

## Monitoring
### App Monitoring
We use newrelic. It is disabled by default in the config, but enabled by the env variable `NEW_RELIC_ENABLED` in our `upstart` script.
The url https://rpm.newrelic.com/accounts/704410/applications/6049400 and the account credentials are stored in LastPass.

### Server Monitoring
We use newrelic. Install instructions are above. To view monitoring, visit https://rpm.newrelic.com/accounts/704410/servers with the account credentials stored in LastPass. 

## Backups
1. Install s3cmd: `sudo apt-get install s3cmd`
2. Copy s3cmd config from secure store to `/home/ubuntu/.s3cfg`

### MongoDB
1. `cp production_scripts/backup/mongo.sh ~/mongodb-backup.sh`
2. `cd ~`
3. `chmod +x mongodb-backup.sh`
4. `crontab -e`
5. Add an entry: `00 01 * * * /bin/bash /home/ubuntu/mongodb-backup.sh`
6. Backups are now scheduled to run at 1 AM daily

### Neo4j
1. `cp production_scripts/backup/neo4j.sh ~/neo4j-backup.sh`
2. `cd ~`
3. `chmod +x neo4j-backup.sh`
4. `crontab -e`
5. Add an entry: `15 01 * * * /bin/bash /home/ubuntu/neo4j-backup.sh`
6. Backups are now scheduled to run at 1:15 AM daily
