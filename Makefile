test:
	./node_modules/mocha/bin/mocha --require should --require sinon test/ examples/*/test.js

.PHONY: test
