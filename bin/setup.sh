#!/usr/bin/env sh
cp hooks/pre-commit-hook.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit

cp hooks/pre-push-hook.sh .git/hooks/pre-push
chmod +x .git/hooks/pre-push

npm install