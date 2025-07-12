#!/usr/bin/env bash

# This script runs GitHub Actions locally using act to test workflows
# It's intended to be used as a pre-commit hook that runs when .pre-commit-config.yaml changes

if $GITHUB_ACTIONS; then exit 0;fi

# Check if act is installed
if ! command -v act &> /dev/null; then
  echo "Error: 'act' command not found. Please install it first:"
  echo "  - macOS: brew install act"
  echo "  - Linux: https://github.com/nektos/act#installation"
  exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
  echo "Error: Docker is not running. Please start Docker first."
  echo "  - Docker Desktop users: Start the Docker Desktop application"
  echo "  - Linux users: Run 'sudo systemctl start docker' or equivalent for your distribution"
  exit 1
fi

echo "Running GitHub Actions workflows locally in dry-run mode..."
act --container-architecture linux/amd64 \
    --workflows .github/workflows/ \
    --dryrun

# Return the exit code from act
exit $?
