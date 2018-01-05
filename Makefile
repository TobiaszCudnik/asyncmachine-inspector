STATES_TYPES_BIN = node_modules/asyncmachine/tools/states-to-types.js
MOCHA = node_modules/.bin/mocha

compile:
	node_modules/.bin/tsc --pretty --noEmit

compile-watch:
	node_modules/.bin/tsc --pretty --watch --noEmit

build:
	node_modules/.bin/tsc --module commonjs --outDir ./build

build-watch:
	node_modules/.bin/tsc --module commonjs --outDir ./build --watch

dist-worker-dev:
	webpack --config config/webpack-worker.config.js

dist-worker-dev-watch:
	webpack --config config/webpack-worker.config.js --watch

dist-worker-prod:
	webpack --config config/webpack-worker-prod.config.js

dist-dev:
	webpack --config config/webpack-worker.config.js
	webpack --config config/webpack.config.js

dist-dev-watch:
	webpack --config config/webpack-worker.config.js --watch &
		webpack --config config/webpack.config.js --watch

dist-debug:
	webpack --config config/webpack-worker-prod.config.js
	webpack --config config/webpack.config.js --devtool sourcemap

dist-debug-watch:
	webpack --config config/webpack-worker.config.js --watch &
		webpack --config config/webpack.config.js \
			--devtool sourcemap --watch

dist-prod:
	webpack --config config/webpack-worker-prod.config.js
	webpack --config config/webpack-prod.config.js

dist-prod-watch:
	webpack --config config/webpack-worker-prod.config.js
	webpack --config config/webpack-prod.config.js --watch

dist-stackblitz:
	webpack --config webpack-stackblitz.config.js

format:
	prettier --single-quote --no-semi --write examples/*/*.ts
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
	`make dist-prod`
	pushd pkg/inspector
	npm publish
	popd

.PHONY: test break build dist
