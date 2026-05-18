#!/bin/bash
# install_mongo.sh
# Script to install MongoDB on Fedora (with SELinux-friendly setup)

set -e

echo "Adding MongoDB repository..."
sudo tee /etc/yum.repos.d/mongodb-org.repo > /dev/null <<EOF
[mongodb-org-6.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/9/mongodb-org/6.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-6.0.asc
EOF

echo "Installing MongoDB..."
sudo dnf install -y mongodb-org

echo "Creating data directory..."
sudo mkdir -p /var/lib/mongo
sudo chown -R mongod:mongod /var/lib/mongo

echo "Setting SELinux context for MongoDB data directory..."
sudo semanage fcontext -a -t mongod_var_lib_t "/var/lib/mongo(/.*)?"
sudo restorecon -Rv /var/lib/mongo

echo "Optional: disabling FTDC to avoid SELinux alerts..."
sudo bash -c 'echo -e "diagnosticDataCollection:\n  enabled: false" >> /etc/mongod.conf'

echo "Starting MongoDB service..."
sudo systemctl start mongod
sudo systemctl enable mongod

echo "MongoDB installed and running!"
mongod --version