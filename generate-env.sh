#!/bin/bash

file=src/environments/env.prod.ts
destination=src/environments/environment.prod.ts
k1={apiUrl}
v1=$API_URL

k2={ibmApiUrl}
v2=$IBM_API_URL

k3={socketUrl}
v3=$SOCKET_URL

cat $file | awk '{gsub(/'$k1'/, 'v' )}1' v="$v1" | awk '{gsub(/'$k2'/, 'v' )}1' v="$v2"| awk '{gsub(/'$k3'/, 'v' )}1' v="$v3" > $destination
