#!/usr/bin/env bash

echo "Open the demo page http://localhost:8080/"

trap 'kill %1; kill %2; kill %3' SIGINT
httpserver |
	ami-server |
	am-inspector --server "http://localhost:3757/" |
	open http://localhost:8080
