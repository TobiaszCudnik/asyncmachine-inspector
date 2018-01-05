#!/usr/bin/env bash

echo "Open the demo page http://localhost:8080/"

httpserver &
	am-server &
	am-inspector --server "http://localhost:3797/" &
	open http://localhost:8080
