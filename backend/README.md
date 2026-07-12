# Forensic Medicine Database Backend

## Technology

- MySQL 8.0+
- Node.js 20+
- Express REST API
- JWT authentication and role checks

## Database installation

Run these scripts in order from MySQL Workbench or the MySQL command line:

1. `database.sql` — database, tables, constraints, base indexes, view, and sample data
2. `sql/02_advanced_objects.sql` — additional indexes, views, procedures, and triggers
3. `sql/03_required_queries.sql` — ten demonstration/report queries
4. `sql/04_security_and_backup.sql` — optional least-privilege database account and backup notes

Example:

```bash
mysql -u root -p < database.sql
mysql -u root -p < sql/02_advanced_objects.sql
mysql -u root -p < sql/03_required_queries.sql
```

## API setup

```bash
cp .env.example .env
npm install
npm run start
```

Change the database password and `JWT_SECRET` in `.env`. The API listens on port 5000 by default. The Vite frontend proxies `/api` to this port.

Demo accounts created by `database.sql`: `admin/admin123`, `jmo/jmo123`, `doctor/doctor123`, `clerk/clerk123`, and `research/research123`. They are for a local demonstration only. New passwords registered through the API are bcrypt hashes.

## Main API groups

`/api/auth`, `/api/patients`, `/api/cases`, `/api/postmortems`, `/api/clinical`, `/api/evidence`, `/api/laboratory-tests`, `/api/reports`, `/api/staff`, `/api/dashboard`, and `/api/audit-logs`.
