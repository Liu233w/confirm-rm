.PHONY: cache
cache:
	deno cache \
	mod.ts cli.ts

.PHONY: test
test:
	deno test \
	--allow-read --allow-write \
	./

.PHONY: build-all
build-all:
	deno run --allow-run ./build.ts ${VERSION}

.PHONY: clean
clean:
	rm -rf ./build