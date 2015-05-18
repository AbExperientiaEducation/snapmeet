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

All commands are on remote machine unless specified

# Special Troubleshooting Section
## LOGS AND RESTARTS:
`sudo tail -f /var/log/nginx/access.log`
`sudo tail -f /var/log/nginx/error.log`
`sudo tail -f /var/log/mongodb/mongod.log`
`sudo tail -f /var/log/neo4j/neo4j.0.0.log`
`sudo tail -f /var/log/meetgun/forever.log`

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
### AWS Console
Todo
- Security group


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

1. `sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10`
2. `echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list`
3. `sudo apt-get update`
4. `sudo apt-get install -y mongodb-org`

To run: `sudo service mongod start`

## Neo4j
Source: https://www.digitalocean.com/community/tutorials/how-to-install-neo4j-on-an-ubuntu-vps

1. `wget -O - http://debian.neo4j.org/neotechnology.gpg.key | sudo apt-key add -`
2. `sudo sh -c "echo 'deb http://debian.neo4j.org/repo stable/' > /etc/apt/sources.list.d/neo4j.list"`
3. `sudo apt-get update`
4. `sudo apt-get install neo4j`

auth lives in: `/var/lib/neo4j/data/dbms/auth` and we want to copy our local version there from `/usr/local/Cellar/neo4j/2.2.0/libexec/data/dbms/auth`
6. On local machine: `scp /usr/local/Cellar/neo4j/2.2.0/libexec/data/dbms/auth ubuntu@meetgun:.`
7. On remote: `sudo mv auth /var/lib/neo4j/data/dbms/auth`
8. `sudo chown neo4j:nogroup /var/lib/neo4j/data/dbms/auth`

To restart server: `service neo4j-service [start, stop, restart]`

## Nginx
Source: https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-14-04

1. `sudo apt-get install nginx`
2. `sudo mkdir /etc/nginx/ssl`
3. `sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/ssl/nginx.key -out /etc/nginx/ssl/nginx.crt`
  - Fill out the prompts appropriately. The most important line is the one that requests the Common Name (e.g. server FQDN or YOUR name). You need to enter the domain name that you want to be associated with your server. You can enter the public IP address instead if you do not have a domain name.
4. `sudo vi /etc/nginx/sites-available/default`
```
server {
    listen 80;
    listen 443 ssl;

    server_name www.meetgun.com;
    ssl_certificate /etc/nginx/ssl/nginx.crt;
    ssl_certificate_key /etc/nginx/ssl/nginx.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

To restart server: `sudo service nginx [start, restart, stop, status]`

## Our code
source: https://www.exratione.com/2013/02/nodejs-and-forever-as-a-service-simple-upstart-and-init-scripts-for-ubuntu/
upstart script

```  
#!upstart
description "Meetgun Management"

start on startup
stop on shutdown

# Run as our user
setuid vagrant

# Respan up to 10 times within 5 seconds
respawn
respawn limit 10 5

# Set env variables
env APP_RUNNER="/home/ubuntu/.nvm/versions/v0.12.1/bin/babel-node"
env APP_EX="/home/ubuntu/meetgun/src/server/server.es6"
env APP_LOG="/var/log/meetgun/server.log"
env NODE_BIN_DIR="/home/ubuntu/.nvm/versions/v0.12.1/bin"
env NODE_PATH="/home/ubuntu/.nvm/versions/v0.12.1/lib/node_modules"
env APPLICATION_PATH="/home/ubuntu/meetgun"

script
    PATH=$NODE_BIN_DIR:$PATH
    cd $APPLICATION_PATH
    exec $APP_RUNNER $APP_EX 2>&1 >> $APP_LOG
end script
```

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

### To Run
1. Copy upstart script to /etc/init/meetgun.conf
2. `sudo start meetgun`

### To update
1. `git pull`
2. `npm install`
3. `gulp build`
4. `sudo restart meetgun`
