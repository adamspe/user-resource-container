TESTS = test/*.js
test:
	TestEnv=true mocha --timeout 5000 $(TESTS)
docker:
	docker build -t adamspe/user-resource-container .

.PHONY: test
