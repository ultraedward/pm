cat > .gitignore <<'EOF'
# dependencies
node_modules

# build output
.next
out

# env files
.env
.env.local

# OS files
.DS_Store

# Prisma local artifacts
prisma/database.db*
data/*.db*
sqlite.db

# logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
EOF
