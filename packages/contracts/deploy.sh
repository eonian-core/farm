#!/bin/bash
 
log=deployments/deploy.logs
 
printf "\n--------------\nNew deployment\n" >> $log
 
# append date to log file
printf '%(%Y-%m-%d %H:%M:%S)T\n' -1 >> $log
 
yarn deploy >> $log