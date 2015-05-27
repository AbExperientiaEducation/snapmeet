#!/bin/bash
clear
printf '%s\n' "Status of our services"
printf '%s\n' "======================"
printf "\n"
printf '%s\n' "NGINX"
printf '%s\n' "----------------------"
sudo service nginx status
printf "\n"
printf '%s\n' "Mongo"
printf '%s\n' "----------------------"
sudo service mongod status
printf "\n"
printf '%s\n' "Neo4j"
printf '%s\n' "----------------------"
sudo service neo4j-service status
printf "\n"
printf '%s\n' "Snapmeet"
printf '%s\n' "----------------------"
sudo status meetgun
printf "\n"
