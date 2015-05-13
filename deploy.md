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
2. `sudo vi /etc/nginx/sites-available/default`
```
server {
    listen 80;

    server_name www.meetgun.com;

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
#
# An example upstart script for running a Node.js process as a service
# using Forever as the process monitor. For more configuration options
# associated with Forever, see: https://github.com/nodejitsu/forever
#
# You will need to set the environment variables noted below to conform to
# your use case, and should change the description.
#
description "Meetgun Management"

start on startup
stop on shutdown

# This line is needed so that Upstart reports the pid of the Node.js process
# started by Forever rather than Forever's pid.
expect fork

# The following environment variables must be set so as to define where Node.js
# and Forever binaries and the Node.js source code can be found.
#
# The example environment variables below assume that Node.js is installed by
# building from source with the standard settings.
#
# It should be easy enough to adapt to the paths to be appropriate to a package
# installation, but note that the packages available in the default repositories
# are far behind the times. Most users will be  building from source to get a
# more recent Node.js version.
#
# The full path to the directory containing the node and forever binaries.
# env NODE_BIN_DIR="/usr/local/bin"
# Set the NODE_PATH to the Node.js main node_modules directory.
# env NODE_PATH="/usr/local/lib/node_modules"
# The application startup Javascript file path.
# env APPLICATION_PATH="/home/node/my-application/start-my-application.js"
# Process ID file path.
# env PIDFILE="/var/run/my-application.pid"
# Log file path.
# env LOG="/var/log/my-application.log"
# Forever settings to prevent the application spinning if it fails on launch.
# env MIN_UPTIME="5000"
# env SPIN_SLEEP_TIME="2000"

env NODE_BIN_DIR="/home/ubuntu/.nvm/versions/v0.12.1/bin"
env NODE_PATH="/home/ubuntu/.nvm/versions/v0.12.1/lib/node_modules"
env APPLICATION_PATH="/home/ubuntu/meetgun"
env APPLICATION_START="src/server/server.es6"
env PIDFILE="/var/run/meetgun.pid"
env LOG="/var/log/meetgun/forever.log"
env MIN_UPTIME="4000"
env SPIN_SLEEP_TIME="2000"

script
    # Add the node executables to the path, which includes Forever if it is
    # installed globally, which it should be.
    PATH=$NODE_BIN_DIR:$PATH
    # The minUptime and spinSleepTime settings stop Forever from thrashing if
    # the application fails immediately on launch. This is generally necessary
    # to avoid loading development servers to the point of failure every time
    # someone makes an error in application initialization code, or bringing
    # down production servers the same way if a database or other critical
    # service suddenly becomes inaccessible.
    cd $APPLICATION_PATH
    exec forever \
        --pidFile $PIDFILE \
        start \
        -a \
        -l $LOG \
        --minUptime $MIN_UPTIME \
        --spinSleepTime $SPIN_SLEEP_TIME \
        -c "babel-node" $APPLICATION_START
end script

pre-stop script
    # Add the node executables to the path.
    PATH=$NODE_BIN_DIR:$PATH
    # Here we're using the pre-stop script to stop the Node.js application
    # process so that Forever is given a chance to do its thing and tidy up
    # its data. Note that doing it this way means that each application that
    # runs under Forever must have a different start file name, regardless of
    # which directory it is in.
    exec forever stop $APPLICATION_PATH
end script
```

1. `sudo apt-get install git`
2. `git clone git@bitbucket.org:igmcdowell/meetgun.git`
3. `npm install -g npm`
4. `npm install --global babel`
5. `npm install --global gulp`
6. `npm install -g forever`
7. `npm install -g igmcdowell/node-migrate`
8. `npm install -g npm-shrinkwrap`
9. `npm install`
10. `migrate`
11. `gulp build`
12. Copy the `.env` file from somewhere
13. `sudo mkdir /var/log/meetgun`
14. `sudo chown -R ubuntu:adm /var/log/meetgun`
15. `sudo touch /var/run/meetgun.pid`
16. `sudo chown ubuntu /var/run/meetgun.pid`

### To Run
1. Copy upstart script to /etc/init/meetgun.conf
2. `sudo start meetgun`

### To update
1. `git pull`
2. `npm install`
3. `gulp build`