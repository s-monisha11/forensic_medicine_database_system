-- Run as a MySQL administrator after changing the example password.
CREATE USER IF NOT EXISTS 'forensic_app'@'localhost' IDENTIFIED BY 'CHANGE_THIS_PASSWORD';
GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE ON forensic_medicine_db.* TO 'forensic_app'@'localhost';
FLUSH PRIVILEGES;

-- Backup: mysqldump -u root -p --routines --triggers forensic_medicine_db > forensic_backup.sql
-- Restore: mysql -u root -p forensic_medicine_db < forensic_backup.sql
