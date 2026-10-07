#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

cd "$ROOT"
pnpm pack --pack-destination "$TMP" >/dev/null
TARBALL="$(ls "$TMP"/*.tgz)"

echo "→ contenido del paquete (.d.ts):"
tar -tzf "$TARBALL" | grep -E 'src/(index|react)\.d\.ts' || { echo "FALTAN los .d.ts en el tarball"; exit 1; }

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
