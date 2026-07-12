DROP DATABASE IF EXISTS forensic_medicine_db;
CREATE DATABASE forensic_medicine_db;
USE forensic_medicine_db;

-- 1. Person
CREATE TABLE Person (
    person_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    nic_passport VARCHAR(50) UNIQUE,
    date_of_birth DATE,
    gender VARCHAR(20),
    address TEXT,
    phone VARCHAR(30)
);

-- 2. CaseType
CREATE TABLE CaseType (
    case_type_id INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL,
    description TEXT
);

-- 3. CaseStatus
CREATE TABLE CaseStatus (
    case_status_id INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(100) NOT NULL,
    description TEXT
);

-- 4. PoliceStation
CREATE TABLE PoliceStation (
    station_id INT AUTO_INCREMENT PRIMARY KEY,
    station_name VARCHAR(255) NOT NULL,
    contact_no VARCHAR(30),
    area VARCHAR(100)
);

-- 5. Court
CREATE TABLE Court (
    court_id INT AUTO_INCREMENT PRIMARY KEY,
    court_name VARCHAR(255) NOT NULL,
    court_type VARCHAR(100),
    location VARCHAR(255)
);

-- 6. Department
CREATE TABLE Department (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(255) NOT NULL,
    office_location VARCHAR(255)
);

-- 7. StaffRole
CREATE TABLE StaffRole (
    staff_role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL,
    description TEXT
);

-- 8. UserRole
CREATE TABLE UserRole (
    user_role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL,
    permission_level INT
);

-- 9. ExaminationType
CREATE TABLE ExaminationType (
    exam_type_id INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL,
    description TEXT
);

-- 10. EvidenceType
CREATE TABLE EvidenceType (
    evidence_type_id INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL,
    description TEXT
);

-- 11. LabTest
CREATE TABLE LabTest (
    lab_test_id INT AUTO_INCREMENT PRIMARY KEY,
    test_name VARCHAR(255) NOT NULL,
    lab_section VARCHAR(100),
    description TEXT
);

-- 12. ReportType
CREATE TABLE ReportType (
    report_type_id INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL,
    description TEXT
);

-- 13. ReportStatus
CREATE TABLE ReportStatus (
    report_status_id INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(100) NOT NULL,
    description TEXT
);

-- 14. MedicoLegalCase
CREATE TABLE MedicoLegalCase (
    case_id INT AUTO_INCREMENT PRIMARY KEY,
    case_number VARCHAR(100) NOT NULL UNIQUE,
    person_id INT,
    case_type_id INT,
    case_status_id INT,
    admission_date DATE,
    FOREIGN KEY (person_id) REFERENCES Person(person_id),
    FOREIGN KEY (case_type_id) REFERENCES CaseType(case_type_id),
    FOREIGN KEY (case_status_id) REFERENCES CaseStatus(case_status_id)
);

-- 15. CaseReference
CREATE TABLE CaseReference (
    reference_id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT,
    police_station_id INT,
    court_id INT,
    police_ref_no VARCHAR(100),
    court_ref_no VARCHAR(100),
    FOREIGN KEY (case_id) REFERENCES MedicoLegalCase(case_id),
    FOREIGN KEY (police_station_id) REFERENCES PoliceStation(station_id),
    FOREIGN KEY (court_id) REFERENCES Court(court_id)
);

-- 16. Incident
CREATE TABLE Incident (
    incident_id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT,
    incident_date DATE,
    incident_time TIME,
    location VARCHAR(255),
    incident_summary TEXT,
    FOREIGN KEY (case_id) REFERENCES MedicoLegalCase(case_id)
);

-- 17. Staff
CREATE TABLE Staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    department_id INT,
    staff_role_id INT,
    full_name VARCHAR(255) NOT NULL,
    registration_no VARCHAR(100),
    phone VARCHAR(30),
    FOREIGN KEY (department_id) REFERENCES Department(department_id),
    FOREIGN KEY (staff_role_id) REFERENCES StaffRole(staff_role_id)
);

-- 18. UserAccount
CREATE TABLE UserAccount (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT,
    user_role_id INT,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (staff_id) REFERENCES Staff(staff_id),
    FOREIGN KEY (user_role_id) REFERENCES UserRole(user_role_id)
);

-- 19. StaffCaseAssignment
CREATE TABLE StaffCaseAssignment (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT,
    staff_id INT,
    assigned_date DATE,
    responsibility VARCHAR(255),
    FOREIGN KEY (case_id) REFERENCES MedicoLegalCase(case_id),
    FOREIGN KEY (staff_id) REFERENCES Staff(staff_id)
);

-- 20. Examination
CREATE TABLE Examination (
    examination_id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT,
    exam_type_id INT,
    examined_by_staff_id INT,
    exam_date DATE,
    findings_summary TEXT,
    FOREIGN KEY (case_id) REFERENCES MedicoLegalCase(case_id),
    FOREIGN KEY (exam_type_id) REFERENCES ExaminationType(exam_type_id),
    FOREIGN KEY (examined_by_staff_id) REFERENCES Staff(staff_id)
);

-- 21. Injury
CREATE TABLE Injury (
    injury_id INT AUTO_INCREMENT PRIMARY KEY,
    examination_id INT,
    injury_type VARCHAR(100),
    body_location VARCHAR(100),
    severity VARCHAR(50),
    description TEXT,
    FOREIGN KEY (examination_id) REFERENCES Examination(examination_id)
);

-- 22. Postmortem
CREATE TABLE Postmortem (
    postmortem_id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT,
    conducted_by_staff_id INT,
    autopsy_date DATE,
    summary TEXT,
    FOREIGN KEY (case_id) REFERENCES MedicoLegalCase(case_id),
    FOREIGN KEY (conducted_by_staff_id) REFERENCES Staff(staff_id)
);

-- 23. CauseOfDeath
CREATE TABLE CauseOfDeath (
    cod_id INT AUTO_INCREMENT PRIMARY KEY,
    postmortem_id INT,
    immediate_cause TEXT,
    underlying_cause TEXT,
    manner_of_death VARCHAR(100),
    FOREIGN KEY (postmortem_id) REFERENCES Postmortem(postmortem_id)
);

-- 24. WitnessStatement
CREATE TABLE WitnessStatement (
    statement_id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT,
    recorded_by_staff_id INT,
    witness_name VARCHAR(255),
    statement_date DATE,
    summary TEXT,
    FOREIGN KEY (case_id) REFERENCES MedicoLegalCase(case_id),
    FOREIGN KEY (recorded_by_staff_id) REFERENCES Staff(staff_id)
);

-- 25. Attachment
CREATE TABLE Attachment (
    attachment_id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT,
    file_name VARCHAR(255),
    file_type VARCHAR(50),
    uploaded_by_staff_id INT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES MedicoLegalCase(case_id),
    FOREIGN KEY (uploaded_by_staff_id) REFERENCES Staff(staff_id)
);

-- 26. EvidenceItem
CREATE TABLE EvidenceItem (
    evidence_id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT,
    evidence_type_id INT,
    evidence_code VARCHAR(100) UNIQUE,
    description TEXT,
    storage_location VARCHAR(255),
    FOREIGN KEY (case_id) REFERENCES MedicoLegalCase(case_id),
    FOREIGN KEY (evidence_type_id) REFERENCES EvidenceType(evidence_type_id)
);

-- 27. BiologicalSample
CREATE TABLE BiologicalSample (
    sample_id INT AUTO_INCREMENT PRIMARY KEY,
    evidence_id INT,
    sample_code VARCHAR(100) UNIQUE,
    sample_type VARCHAR(100),
    collection_date DATE,
    collected_by_staff_id INT,
    FOREIGN KEY (evidence_id) REFERENCES EvidenceItem(evidence_id),
    FOREIGN KEY (collected_by_staff_id) REFERENCES Staff(staff_id)
);

-- 28. ChainOfCustody
CREATE TABLE ChainOfCustody (
    custody_id INT AUTO_INCREMENT PRIMARY KEY,
    evidence_id INT,
    case_id INT,
    from_staff_id INT,
    to_staff_id INT,
    transfer_datetime DATETIME,
    remarks TEXT,
    FOREIGN KEY (evidence_id) REFERENCES EvidenceItem(evidence_id),
    FOREIGN KEY (case_id) REFERENCES MedicoLegalCase(case_id),
    FOREIGN KEY (from_staff_id) REFERENCES Staff(staff_id),
    FOREIGN KEY (to_staff_id) REFERENCES Staff(staff_id)
);

-- 29. TestRequest
CREATE TABLE TestRequest (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT,
    sample_id INT,
    lab_test_id INT,
    requested_by_staff_id INT,
    request_date DATE,
    FOREIGN KEY (case_id) REFERENCES MedicoLegalCase(case_id),
    FOREIGN KEY (sample_id) REFERENCES BiologicalSample(sample_id),
    FOREIGN KEY (lab_test_id) REFERENCES LabTest(lab_test_id),
    FOREIGN KEY (requested_by_staff_id) REFERENCES Staff(staff_id)
);

-- 30. TestResult
CREATE TABLE TestResult (
    result_id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT,
    result_text TEXT,
    result_date DATE,
    verified_by_staff_id INT,
    status VARCHAR(50),
    FOREIGN KEY (request_id) REFERENCES TestRequest(request_id),
    FOREIGN KEY (verified_by_staff_id) REFERENCES Staff(staff_id)
);

-- 31. CourtReport
CREATE TABLE CourtReport (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT,
    report_type_id INT,
    report_status_id INT,
    prepared_by_staff_id INT,
    created_date DATE,
    FOREIGN KEY (case_id) REFERENCES MedicoLegalCase(case_id),
    FOREIGN KEY (report_type_id) REFERENCES ReportType(report_type_id),
    FOREIGN KEY (report_status_id) REFERENCES ReportStatus(report_status_id),
    FOREIGN KEY (prepared_by_staff_id) REFERENCES Staff(staff_id)
);

-- 32. AuditLog
CREATE TABLE AuditLog (
    audit_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action_type VARCHAR(100),
    target_table VARCHAR(100),
    action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES UserAccount(user_id)
);
