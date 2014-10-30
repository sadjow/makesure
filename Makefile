test:
	./node_modules/mocha/bin/mocha --require should test/ examples/*/test.js

.PHONY: test
