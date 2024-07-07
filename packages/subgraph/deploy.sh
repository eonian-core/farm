#!/bin/bash


output=$(yarn graph deploy --studio $SUBGRAPH_ENVIRONMENT ./deploy/environments/$SUBGRAPH_ENVIRONMENT.yaml --version-label=$VERSION --deploy-key $SUBGRAPH_DEPLOY_KEY 2>&1)
echo "$output"
if echo "$output" | grep -q "UNCAUGHT EXCEPTION"; then 
  exit 1
fi