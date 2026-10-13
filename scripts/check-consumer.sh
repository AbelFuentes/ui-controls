#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

cd "$ROOT"
pnpm pack --pack-destination "$TMP" >/dev/null
TARBALL="$(ls "$TMP"/*.tgz)"
LIST="$(tar -tzf "$TARBALL")"

echo "→ contenido del paquete:"
grep -E 'package/dist/(index|react)\.d\.ts' <<<"$LIST" || { echo "FALTAN los .d.ts en el tarball"; exit 1; }
grep -E 'package/dist/(ui-controls\.min\.js|tokens\.css)' <<<"$LIST" || { echo "FALTAN el bundle o tokens.css"; exit 1; }
if grep -q 'package/src/' <<<"$LIST"; then echo "src/ no debe publicarse"; exit 1; fi

mkdir "$TMP/consumer" && cd "$TMP/consumer"
echo '{"name":"consumer","private":true,"type":"module"}' > package.json
pnpm add react@19 react-dom@19 @types/react@19 typescript "$TARBALL" >/dev/null
cat > tsconfig.json <<'JSON'
{
  "compilerOptions": {
    "target": "ES2022", "module": "ESNext", "moduleResolution": "Bundler",
    "jsx": "react-jsx", "strict": true, "noEmit": true, "skipLibCheck": false,
    "lib": ["ES2022", "DOM", "DOM.Iterable"]
  },
  "include": ["App.tsx"]
}
JSON
cp "$ROOT/tests/types/consumer.tsx" App.tsx
npx tsc -p tsconfig.json
echo "✓ consumidor React 19 + TypeScript compila sin declaraciones propias"
