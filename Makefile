STATES_TYPES_BIN = node_modules/asyncmachine/tools/states-to-types.js
MOCHA = node_modules/.bin/mocha

compile:
	node_modules/.bin/tsc --pretty --noEmit

compile-watch:
	node_modules/.bin/tsc --pretty --watch --noEmit

build:
	node_modules/.bin/tsc --module commonjs

build-watch:
	node_modules/.bin/tsc --module commonjs --watch

dist:
	webpack

dist-watch:
	webpack --watch

dist-debug:
	webpack --devtool sourcemap

dist-debug-watch:
	webpack --devtool sourcemap --watch

dist-production:
	webpack --devtool none --optimize-minimize

dist-stackblitz:
	webpack --config webpack-stackblitz.config.js

format:
	prettier --single-quote --no-semi --write dev/stackblitz-demo/*.ts
	prettier --single-quote --no-semi --write src/**.ts
	prettier --single-quote --no-semi --write src/**/*.ts
	prettier --single-quote --no-semi --write src/**/*.tsx
	prettier --single-quote --no-semi --write src/**/**/*.ts
	prettier --single-quote --no-semi --write src/**/**/*.tsx

state-types:
	-`make build`
	node $(STATES_TYPES_BIN) src/ui/states.js -s
	prettier --single-quote --no-semi --write src/ui/states.js

test:
	$(MOCHA) test/no-ui/

cjs-to-es6:
	sed 's/^exports\["inspector"\]/let def/' dist/inspector-cjs.js > dist/inspector-es6.js
	echo '\nexport const Inspector = def.Inspector\nexport const Network = def.Network\nexport const Logger = def.Logger\ndef = def.default\nexport default def' >> dist/inspector-es6.js

publish:
	npm publish

.PHONY: test break build dist
