#!/usr/bin/env bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}===========================================${NC}"
echo -e "${BLUE}   SchoolQuest Arch Linux Automated Setup  ${NC}"
echo -e "${BLUE}===========================================${NC}"

# 1. Install dependencies via pacman
echo -e "\n${YELLOW}[1/6] Installing system packages via pacman...${NC}"
sudo pacman -S --needed --noconfirm git curl unzip composer mariadb \
    php php-intl php-sodium php-sqlite php-gd

# 2. Configure /etc/php/php.ini extensions
echo -e "\n${YELLOW}[2/6] Enabling PHP extensions in /etc/php/php.ini...${NC}"
EXTENSIONS=(bcmath curl fileinfo gd iconv intl mbstring mysqli pdo_mysql pdo_sqlite sqlite3 zip)

for ext in "${EXTENSIONS[@]}"; do
    if grep -q "^;extension=${ext}" /etc/php/php.ini; then
        sudo sed -i "s/^;extension=${ext}/extension=${ext}/" /etc/php/php.ini
        echo "  - Enabled: ${ext}"
    elif grep -q "^extension=${ext}" /etc/php/php.ini; then
        echo "  - Already enabled: ${ext}"
    else
        echo "extension=${ext}" | sudo tee -a /etc/php/php.ini > /dev/null
        echo "  - Added: ${ext}"
    fi
done

# 3. MariaDB initialization and start
echo -e "\n${YELLOW}[3/6] Configuring MariaDB service...${NC}"
if [ ! -d "/var/lib/mysql/mysql" ]; then
    echo "Initializing MariaDB data directory..."
    sudo mariadb-install-db --user=mysql --basedir=/usr --datadir=/var/lib/mysql
fi

echo "Starting MariaDB..."
sudo systemctl enable --now mariadb

# 4. Create Database & User
echo -e "\n${YELLOW}[4/6] Creating database and user 'sq_user'...${NC}"
sudo mariadb -u root <<EOF
CREATE DATABASE IF NOT EXISTS school_quest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'sq_user'@'localhost' IDENTIFIED BY 'password';
CREATE USER IF NOT EXISTS 'sq_user'@'127.0.0.1' IDENTIFIED BY 'password';
ALTER USER 'sq_user'@'localhost' IDENTIFIED BY 'password';
ALTER USER 'sq_user'@'127.0.0.1' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON school_quest.* TO 'sq_user'@'localhost';
GRANT ALL PRIVILEGES ON school_quest.* TO 'sq_user'@'127.0.0.1';
FLUSH PRIVILEGES;
EOF

# Restore database from backup
if [ -f "database/school_quest_backup.sql" ]; then
    echo "Restoring database from database/school_quest_backup.sql..."
    mariadb -u sq_user -ppassword school_quest < database/school_quest_backup.sql
    echo "Database restored successfully."
fi

# 5. PHP Dependencies
echo -e "\n${YELLOW}[5/6] Installing Composer packages...${NC}"
composer install

# 6. Laravel setup
echo -e "\n${YELLOW}[6/6] Finalizing Laravel setup...${NC}"
php artisan storage:link || true
php artisan optimize:clear

echo -e "\n${GREEN}===========================================${NC}"
echo -e "${GREEN}  ✔ SchoolQuest Setup Completed Successfully!  ${NC}"
echo -e "${GREEN}===========================================${NC}"
echo -e "\nYou can now run the app using either:"
echo -e "  ${YELLOW}composer run dev${NC}  (starts both backend and frontend)"
echo -e "or run in two separate tabs:"
echo -e "  Tab 1: ${YELLOW}php artisan serve${NC}"
echo -e "  Tab 2: ${YELLOW}npm run dev${NC}"
echo -e "\nOpen ${BLUE}http://127.0.0.1:8000${NC} in your browser."
