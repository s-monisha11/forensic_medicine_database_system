import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import caseRoutes from './routes/caseRoutes.js';
import postmortemRoutes from './routes/postmortemRoutes.js';
import clinicalRoutes from './routes/clinicalRoutes.js';
import evidenceRoutes from './routes/evidenceRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import laboratoryRoutes from './routes/laboratoryRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import { authenticate } from './middleware.js';

dotenv.config();
const app = express();
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:3000').split(',');
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', system: 'Forensic Medicine Database API' }));

// Routes
app.use('/api/auth', authRoutes);
// All operational data is medico-legal information and therefore requires login.
app.use('/api', authenticate);
app.use('/api/patients', patientRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/postmortems', postmortemRoutes);
app.use('/api/clinical', clinicalRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/laboratory-tests', laboratoryRoutes);
app.use('/api/audit-logs', auditRoutes);

app.use((req, res) => res.status(404).json({ message: 'API endpoint not found' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Unexpected server error' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
