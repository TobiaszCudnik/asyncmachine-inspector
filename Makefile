STATES_TYPES_BIN = node_modules/asyncmachine/tools/states-to-types.js

compile:
	node_modules/.bin/tsc --pretty --noEmit

compile-watch:
	node_modules/.bin/tsc --pretty --watch --noEmit

build:
	node_modules/.bin/tsc 

build-watch:
	node_modules/.bin/tsc --watch

format:
	prettier --single-quote --no-semi --write src/**/*.ts

state-types:
	node $(STATES_TYPES_BIN) src/ui/states.js -s
	prettier --single-quote --no-semi --write src/ui/states.js

.PHONY: test break build
