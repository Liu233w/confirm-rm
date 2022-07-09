interface Target {
    target: string;
    suffix: string;
}

const VERSION = removeV(Deno.args[0])

console.log('Build using version number:', VERSION)

const TARGETS: Target[] = [
    { target: 'x86_64-unknown-linux-gnu', suffix: '' },
    { target: 'x86_64-pc-windows-msvc', suffix: '.exe' },
    { target: 'x86_64-apple-darwin', suffix: '' },
    { target: 'aarch64-apple-darwin', suffix: '' }
];

for (const { target, suffix } of TARGETS) {
    await Deno.run({
        cmd: [
            'deno', 'compile',
            '--allow-read', '--allow-write',
            '--output', `build/confirm-rm-${VERSION}-${target}${suffix}`,
            '--target', target,
            'cli.ts'
        ]
    }).status();
}

function removeV(version: string) {
    if (version.startsWith('v')) {
        return version.slice(1)
    } else {
        return version
    }
}