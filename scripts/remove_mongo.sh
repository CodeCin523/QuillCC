#!/bin/bash
# remove_mongo.sh
# Script to fully remove MongoDB from Fedora (including SELinux context)

set -e

echo "Stopping MongoDB service..."
sudo systemctl stop mongod || true
sudo systemctl disable mongod || true

echo "Removing MongoDB packages..."
sudo dnf remove -y mongodb-org* || true

echo "Removing data and log directories..."
if [ -d "/var/lib/mongo" ]; then
    sudo rm -rf /var/lib/mongo
    echo "Removed /var/lib/mongo"
fi

if [ -d "/var/log/mongodb" ]; then
    sudo rm -rf /var/log/mongodb
    echo "Removed /var/log/mongodb"
fi

echo "Removing SELinux context for MongoDB (if any)..."
sudo semanage fcontext -d "/var/lib/mongo(/.*)?" || true

echo "Removing repository file..."
if [ -f "/etc/yum.repos.d/mongodb-org.repo" ]; then
    sudo rm -f /etc/yum.repos.d/mongodb-org.repo
    echo "Removed MongoDB repo file"
fi

echo "MongoDB fully removed!"