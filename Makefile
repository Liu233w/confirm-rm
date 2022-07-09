cache:
	deno cache \
	mod.ts cli.ts

test:
	deno test \
	--allow-read --allow-write \
	./

build-all:
	deno run --allow-run ./build.ts ${VERSION}

clean:
	rm -rf ./build