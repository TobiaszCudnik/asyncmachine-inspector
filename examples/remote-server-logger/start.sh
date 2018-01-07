#!/usr/bin/env bash

tsc

trap 'kill %1; kill %2' SIGINT
node index.js |
	am-server |
	am-inspector --server "http://localhost:3757/"
