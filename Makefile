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

# make version version=x.x.x
version:
	npm --no-git-tag-version --allow-same-version version $(version)

	cd pkg/inspector && \
		npm --no-git-tag-version --allow-same-version version $(version)

	cd pkg/logger && \
		npm --no-git-tag-version --allow-same-version version $(version)

	cd pkg/server && \
		npm --no-git-tag-version --allow-same-version version $(version)

publish:
	-make build
	make dist-prod

	rm -Rf pkg/tmp
	cp -RL pkg/inspector pkg/tmp
	cd pkg/tmp && \
		npm publish

	rm -Rf pkg/tmp
	cp -RL pkg/logger pkg/tmp
	cd pkg/tmp && \
		npm publish

	rm -Rf pkg/tmp
	cp -RL pkg/server pkg/tmp
	cd pkg/tmp && \
		npm publish

	rm -R pkg/tmp

npmi:
	npm link asyncmachine

dts:
	./node_modules/dts-bundle/lib/dts-bundle.js \
		--name "test" \
		--main build/inspector/inspector.d.ts \
		--emitOnIncludedFileNotFound

.PHONY: test break build dist
