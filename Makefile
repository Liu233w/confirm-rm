cache:
	deno cache \
	mod.ts cli.ts

test:
	deno test \
	--allow-read --allow-write \
	./

compile:
	deno compile \
	--allow-read --allow-write \
	--output build/confirm-rm \
	cli.ts