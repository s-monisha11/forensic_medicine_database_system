DROP DATABASE IF EXISTS forensic_medicine_db;
CREATE DATABASE forensic_medicine_db;
USE forensic_medicine_db;

CREATE TABLE staff (
  staff_id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  role ENUM('Admin','JMO','Doctor','Laboratory Staff','Clerical Officer','Research User') NOT NULL,
  specialization VARCHAR(100),
  contact_no VARCHAR(30),
  email VARCHAR(120) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  staff_id INT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  user_role ENUM('admin','jmo','doctor','lab','clerical','research') NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE SET NULL
);

CREATE TABLE patients (
  patient_id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  nic VARCHAR(20) UNIQUE,
  age INT NOT NULL CHECK (age >= 0 AND age <= 130),
  gender ENUM('Male','Female','Other','Unknown') NOT NULL,
  address VARCHAR(255),
  contact_no VARCHAR(30),
  hospital_bht VARCHAR(50) UNIQUE,
  ward VARCHAR(50),
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE medico_legal_cases (
  case_id INT AUTO_INCREMENT PRIMARY KEY,
  case_number VARCHAR(50) NOT NULL UNIQUE,
  patient_id INT NOT NULL,
  case_type ENUM('Clinical','Autopsy') NOT NULL,
  incident_date DATE NOT NULL,
  incident_location VARCHAR(255),
  police_station VARCHAR(100),
  description TEXT,
  assigned_staff_id INT,
  status ENUM('Pending','In Progress','Completed','Urgent','Closed') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE RESTRICT,
  FOREIGN KEY (assigned_staff_id) REFERENCES staff(staff_id) ON DELETE SET NULL
);

CREATE TABLE postmortems (
  postmortem_id INT AUTO_INCREMENT PRIMARY KEY,
  case_id INT NOT NULL UNIQUE,
  examination_date DATE NOT NULL,
  findings TEXT,
  cause_of_death VARCHAR(255),
  remarks TEXT,
  performed_by INT,
  FOREIGN KEY (case_id) REFERENCES medico_legal_cases(case_id) ON DELETE CASCADE,
  FOREIGN KEY (performed_by) REFERENCES staff(staff_id) ON DELETE SET NULL
);

CREATE TABLE clinical_examinations (
  examination_id INT AUTO_INCREMENT PRIMARY KEY,
  case_id INT NOT NULL,
  examination_date DATE NOT NULL,
  injuries TEXT,
  findings TEXT,
  recommendation TEXT,
  examined_by INT,
  FOREIGN KEY (case_id) REFERENCES medico_legal_cases(case_id) ON DELETE CASCADE,
  FOREIGN KEY (examined_by) REFERENCES staff(staff_id) ON DELETE SET NULL
);

CREATE TABLE evidence (
  evidence_id INT AUTO_INCREMENT PRIMARY KEY,
  evidence_code VARCHAR(50) NOT NULL UNIQUE,
  case_id INT NOT NULL,
  evidence_type VARCHAR(100) NOT NULL,
  description TEXT,
  storage_location VARCHAR(120) NOT NULL,
  collected_date DATE NOT NULL,
  collected_by INT,
  current_status ENUM('Collected','Stored','Sent to Laboratory','Returned','Disposed') DEFAULT 'Stored',
  FOREIGN KEY (case_id) REFERENCES medico_legal_cases(case_id) ON DELETE CASCADE,
  FOREIGN KEY (collected_by) REFERENCES staff(staff_id) ON DELETE SET NULL
);

CREATE TABLE chain_of_custody (
  custody_id INT AUTO_INCREMENT PRIMARY KEY,
  evidence_id INT NOT NULL,
  from_staff_id INT,
  to_staff_id INT,
  transfer_date DATETIME NOT NULL,
  purpose VARCHAR(255),
  remarks TEXT,
  FOREIGN KEY (evidence_id) REFERENCES evidence(evidence_id) ON DELETE CASCADE,
  FOREIGN KEY (from_staff_id) REFERENCES staff(staff_id) ON DELETE SET NULL,
  FOREIGN KEY (to_staff_id) REFERENCES staff(staff_id) ON DELETE SET NULL
);

CREATE TABLE laboratory_tests (
  test_id INT AUTO_INCREMENT PRIMARY KEY,
  evidence_id INT NOT NULL,
  test_type VARCHAR(100) NOT NULL,
  result TEXT,
  tested_by INT,
  test_date DATE,
  status ENUM('Pending','Completed','Rejected') DEFAULT 'Pending',
  FOREIGN KEY (evidence_id) REFERENCES evidence(evidence_id) ON DELETE CASCADE,
  FOREIGN KEY (tested_by) REFERENCES staff(staff_id) ON DELETE SET NULL
);

CREATE TABLE court_reports (
  report_id INT AUTO_INCREMENT PRIMARY KEY,
  case_id INT NOT NULL,
  report_type ENUM('Medico-Legal','Postmortem','Clinical Examination','Laboratory','Court Submission') NOT NULL,
  prepared_by INT,
  submission_date DATE,
  court_name VARCHAR(150),
  status ENUM('Draft','Pending','Submitted','Approved','Rejected') DEFAULT 'Draft',
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (case_id) REFERENCES medico_legal_cases(case_id) ON DELETE CASCADE,
  FOREIGN KEY (prepared_by) REFERENCES staff(staff_id) ON DELETE SET NULL
);

CREATE TABLE audit_logs (
  audit_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(50) NOT NULL,
  table_name VARCHAR(80),
  record_id INT,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_patient_nic ON patients(nic);
CREATE INDEX idx_case_number ON medico_legal_cases(case_number);
CREATE INDEX idx_case_status ON medico_legal_cases(status);
CREATE INDEX idx_report_status ON court_reports(status);

-- View
CREATE VIEW vw_case_summary AS
SELECT c.case_id, c.case_number, c.case_type, c.incident_date, c.police_station, c.status,
       p.full_name AS patient_name, p.nic, s.full_name AS assigned_staff
FROM medico_legal_cases c
JOIN patients p ON c.patient_id = p.patient_id
LEFT JOIN staff s ON c.assigned_staff_id = s.staff_id;

-- Seed data: Staff
INSERT INTO staff(full_name, role, specialization, contact_no, email) VALUES
('Dr. A. Perera','JMO','Forensic Medicine','0771234567','jmo@forensic.local'),
('Dr. N. Silva','Doctor','Clinical Forensics','0772222222','doctor@forensic.local'),
('Ms. K. Fernando','Clerical Officer',NULL,'0773333333','clerk@forensic.local'),
('System Admin','Admin','IT Administration','0774444444','admin@forensic.local'),
('Research User','Research User','Statistics','0775555555','research@forensic.local');

-- Seed data: Users (bcrypt password hashes; see backend README for demo credentials)
INSERT INTO users(staff_id, username, password_hash, full_name, user_role) VALUES
(4,'admin','$2a$10$yRABIlvgIHxe4lmp3kQnAuODRVmL0W.hJaQSWfsk8VR2575VClJc.','System Admin','admin'),
(1,'jmo','$2a$10$xNlcfUZifMH36FC70toojO.jk1QLsYC8/5Jymlxd.CmHnWtyys5E6','Dr. A. Perera','jmo'),
(2,'doctor','$2a$10$7hPLPbP6zNWPGK84JsW0J.n6T/ux7q5YDjp24831DCUFQGbuz3mya','Dr. N. Silva','doctor'),
(3,'clerk','$2a$10$xtnOZux78gJPDftmR7TVIewlii17Qosie5xpba3nCEmiEMosx1bq6','Ms. K. Fernando','clerical'),
(5,'research','$2a$10$mfIqfomYUjKsAZqxEYNfYusGTbzx0nPXYTfYJtR28FnGRwl41ne0W','Research User','research');

-- Seed data: Patients
INSERT INTO patients(full_name,nic,age,gender,address,contact_no,hospital_bht,ward) VALUES
('W.M. Silva','923456789V',35,'Male','123 Main Street, Colombo','0771234567','BHT-2026-001','Ward 05'),
('K.D. Fernando','885678901V',41,'Female','Kandy Road, Kandy','0779876543','BHT-2026-002','Ward 02'),
('S.A. Wijesuriya','901234567V',28,'Male','45 Temple Road, Galle','0771112233','BHT-2026-003','Ward 03'),
('R.P. Wickramasinghe','875432109V',55,'Male','Residence, 123 Galle Road','0774445566','BHT-2026-004','Ward 01'),
('A.S. Perera','867890123V',32,'Female','Apartment Complex, Colombo','0778889900','BHT-2026-005','Ward 04'),
('N.P. Gunasekara','912345678V',45,'Male','67 Lake Road, Matara','0776667788','BHT-2026-006','Ward 02');

-- Seed data: Cases
INSERT INTO medico_legal_cases(case_number,patient_id,case_type,incident_date,incident_location,police_station,description,assigned_staff_id,status) VALUES
('CLN-2026-001',1,'Clinical','2026-06-20','Colombo','Colombo Central','Assault related clinical examination - blunt force trauma',2,'Pending'),
('PM-2026-001',2,'Autopsy','2026-06-21','Kandy','Kandy Police','Postmortem examination requested by court - accidental death',1,'In Progress'),
('CLN-2026-002',3,'Clinical','2026-06-22','Galle','Galle Police','Poisoning suspected - clinical examination',2,'In Progress'),
('PM-2026-002',4,'Autopsy','2026-06-23','Colombo','Colombo Central','Homicide investigation - multiple stab wounds',1,'Urgent'),
('CLN-2026-003',5,'Clinical','2026-06-24','Colombo','Colombo South','Sharp weapon injury - clinical examination',2,'Completed'),
('PM-2026-003',6,'Autopsy','2026-06-25','Matara','Matara Police','Suspicious death - hanging',1,'Pending');

-- Seed data: Evidence
INSERT INTO evidence(evidence_code,case_id,evidence_type,description,storage_location,collected_date,collected_by,current_status) VALUES
('EV-2026-001',1,'Blood sample','Sample collected for alcohol test','Evidence Locker A1','2026-06-20',2,'Stored'),
('EV-2026-002',2,'Clothing','Clothing submitted by police','Evidence Locker B2','2026-06-21',1,'Sent to Laboratory'),
('EV-2026-003',3,'Biological Sample','Blood sample for toxicology','Lab Refrigeration Unit 3','2026-06-22',2,'Stored'),
('EV-2026-004',4,'Physical Evidence','Bloodstained clothing','Evidence Room A - Shelf 12','2026-06-23',1,'Collected'),
('EV-2026-005',5,'Documents','Medical records','Evidence Room B - Cabinet 5','2026-06-24',2,'Stored'),
('EV-2026-006',1,'Photographic','Injury documentation photos','Digital Archive','2026-06-20',2,'Stored');

-- Seed data: Postmortems
INSERT INTO postmortems(case_id,examination_date,findings,cause_of_death,remarks,performed_by) VALUES
(2,'2026-06-22','External and internal examination recorded. Severe head trauma observed.','Severe head trauma - accidental','Preliminary report prepared',1),
(4,'2026-06-24','Multiple stab wounds to torso. Internal organ damage.','Multiple stab wounds - homicide','Toxicology report pending',1);

-- Seed data: Clinical examinations
INSERT INTO clinical_examinations(case_id,examination_date,injuries,findings,recommendation,examined_by) VALUES
(1,'2026-06-20','Multiple contusions on upper limbs','Blunt force trauma. X-ray shows no fractures.','Further observation required. Follow-up in 2 weeks.',2),
(3,'2026-06-22','No external injuries visible','Suspected poisoning. Samples sent to lab.','Await toxicology results before final opinion.',2),
(5,'2026-06-24','Laceration on left forearm (8cm)','Sharp weapon injury consistent with knife wound.','Wound sutured. Complete recovery expected.',2);

-- Seed data: Court reports
INSERT INTO court_reports(case_id,report_type,prepared_by,submission_date,court_name,status,remarks) VALUES
(1,'Clinical Examination',2,NULL,'Colombo Magistrate Court','Pending','Awaiting final approval'),
(2,'Postmortem',1,NULL,'Kandy High Court','Draft','Toxicology report pending'),
(5,'Medico-Legal',2,'2026-06-28','Galle Magistrate Court','Submitted','Report dispatched to court'),
(4,'Postmortem',1,NULL,'Colombo High Court','Draft','Investigation ongoing');

-- Seed data: Chain of custody
INSERT INTO chain_of_custody(evidence_id,from_staff_id,to_staff_id,transfer_date,purpose,remarks) VALUES
(1,2,NULL,'2026-06-20 09:15:00','Evidence Collected','Collected at scene'),
(1,NULL,2,'2026-06-20 11:30:00','Transferred to Lab','For alcohol test'),
(2,1,NULL,'2026-06-21 10:00:00','Evidence Collected','Received from police'),
(2,NULL,1,'2026-06-21 14:00:00','Stored in Evidence Room','Awaiting analysis');

-- Seed data: Laboratory tests
INSERT INTO laboratory_tests(evidence_id,test_type,result,tested_by,test_date,status) VALUES
(1,'Blood Alcohol Analysis','Blood alcohol concentration below legal limit',2,'2026-06-21','Completed'),
(2,'Trace Fibre Analysis',NULL,NULL,NULL,'Pending'),
(3,'Toxicology Screening',NULL,NULL,NULL,'Pending');
