STATES_TYPES_BIN = node_modules/asyncmachine/tools/states-to-types.js
MOCHA = node_modules/.bin/mocha

compile:
	node_modules/.bin/tsc --pretty --noEmit

compile-watch:
	node_modules/.bin/tsc --pretty --watch --noEmit

build:
	node_modules/.bin/tsc 

build-watch:
	node_modules/.bin/tsc --watch

dist:
	webpack

dist-watch:
	webpack --watch

dist-opt:
	webpack --optimize-minimize

format:
	prettier --single-quote --no-semi --write src/**.ts
	prettier --single-quote --no-semi --write src/**/*.ts
	prettier --single-quote --no-semi --write src/**/*.tsx

state-types:
	node $(STATES_TYPES_BIN) src/ui/states.js -s
	prettier --single-quote --no-semi --write src/ui/states.js

test:
	$(MOCHA) test/no-ui/

cjs-to-es6:
	sed 's/^exports\["inspector"\]/let def/' dist/inspector.commonjs.js > dist/inspector.es6.js
	echo '\nexport const Inspector = def.Inspector\ndef = def.default\nexport default def' >> dist/inspector.es6.js

.PHONY: test break build dist
