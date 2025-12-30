#!/usr/bin/env bash

NAME=$1

if [ -z "$NAME" ]; then
  echo "Usage: ./scripts/new-feature.sh feature-name"
  exit 1
fi

FEATURE_DIR="app/features/$NAME"
PAGE_DIR="app/$NAME"

mkdir -p "$FEATURE_DIR"
mkdir -p "$PAGE_DIR"

# Feature view
cat <<EOT > "$FEATURE_DIR/${NAME^}View.tsx"
import Card from "../../components/Card"

export default function ${NAME^}View() {
  return (
    <Card>
      <p className="text-sm text-gray-500">
        ${NAME^} feature (UI-only)
      </p>
    </Card>
  )
}
EOT

# Page wrapper
cat <<EOT > "$PAGE_DIR/page.tsx"
import PageShell from "../components/PageShell"
import ${NAME^}View from "../features/$NAME/${NAME^}View"

export default function Page() {
  return (
    <PageShell title="${NAME^}">
      <${NAME^}View />
    </PageShell>
  )
}
EOT

echo "Feature '$NAME' created."
