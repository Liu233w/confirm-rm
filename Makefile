compile:
	deno compile \
	--allow-read --allow-write \
	--import-map import_map.json \
	--output build/confirm-rm \
	cli.ts