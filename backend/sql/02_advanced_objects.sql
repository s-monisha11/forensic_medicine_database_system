USE forensic_medicine_db;

-- Additional indexes selected for joins, date filtering and operational queues.
CREATE INDEX idx_cases_patient ON medico_legal_cases(patient_id);
CREATE INDEX idx_cases_assigned_staff ON medico_legal_cases(assigned_staff_id);
CREATE INDEX idx_cases_incident_date ON medico_legal_cases(incident_date);
CREATE INDEX idx_evidence_case ON evidence(case_id);
CREATE INDEX idx_evidence_status ON evidence(current_status);
CREATE INDEX idx_tests_evidence_status ON laboratory_tests(evidence_id, status);
CREATE INDEX idx_reports_case ON court_reports(case_id);
CREATE INDEX idx_reports_submission_date ON court_reports(submission_date);
CREATE INDEX idx_custody_evidence_date ON chain_of_custody(evidence_id, transfer_date);

CREATE OR REPLACE VIEW vw_pending_work AS
SELECT c.case_id, c.case_number, c.case_type, p.full_name AS patient_name,
       c.status AS case_status, s.full_name AS assigned_to,
       DATEDIFF(CURRENT_DATE, c.incident_date) AS days_open
FROM medico_legal_cases c
JOIN patients p ON p.patient_id = c.patient_id
LEFT JOIN staff s ON s.staff_id = c.assigned_staff_id
WHERE c.status NOT IN ('Completed', 'Closed');

CREATE OR REPLACE VIEW vw_evidence_register AS
SELECT e.evidence_id, e.evidence_code, c.case_number, e.evidence_type,
       e.storage_location, e.current_status, e.collected_date,
       s.full_name AS collected_by, COUNT(coc.custody_id) AS transfer_count
FROM evidence e
JOIN medico_legal_cases c ON c.case_id = e.case_id
LEFT JOIN staff s ON s.staff_id = e.collected_by
LEFT JOIN chain_of_custody coc ON coc.evidence_id = e.evidence_id
GROUP BY e.evidence_id, e.evidence_code, c.case_number, e.evidence_type,
         e.storage_location, e.current_status, e.collected_date, s.full_name;

CREATE OR REPLACE VIEW vw_monthly_case_statistics AS
SELECT DATE_FORMAT(incident_date, '%Y-%m') AS case_month,
       SUM(case_type='Clinical') AS clinical_cases,
       SUM(case_type='Autopsy') AS autopsy_cases,
       COUNT(*) AS total_cases,
       SUM(status IN ('Pending','In Progress','Urgent')) AS open_cases,
       SUM(status IN ('Completed','Closed')) AS completed_cases
FROM medico_legal_cases
GROUP BY DATE_FORMAT(incident_date, '%Y-%m');

DELIMITER $$

CREATE PROCEDURE sp_register_patient_and_case(
  IN p_full_name VARCHAR(120), IN p_nic VARCHAR(20), IN p_age INT,
  IN p_gender VARCHAR(10), IN p_address VARCHAR(255), IN p_contact_no VARCHAR(30),
  IN p_hospital_bht VARCHAR(50), IN p_ward VARCHAR(50), IN p_case_type VARCHAR(20),
  IN p_incident_date DATE, IN p_incident_location VARCHAR(255),
  IN p_police_station VARCHAR(100), IN p_description TEXT, IN p_assigned_staff_id INT
)
BEGIN
  DECLARE v_patient_id INT;
  DECLARE v_case_number VARCHAR(50);
  DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN ROLLBACK; RESIGNAL; END;
  IF p_age < 0 OR p_age > 130 THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Age must be between 0 and 130'; END IF;
  IF p_case_type NOT IN ('Clinical','Autopsy') THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Invalid case type'; END IF;
  START TRANSACTION;
    INSERT INTO patients(full_name,nic,age,gender,address,contact_no,hospital_bht,ward)
    VALUES(p_full_name,NULLIF(p_nic,''),p_age,p_gender,NULLIF(p_address,''),NULLIF(p_contact_no,''),NULLIF(p_hospital_bht,''),NULLIF(p_ward,''));
    SET v_patient_id = LAST_INSERT_ID();
    SET v_case_number = CONCAT(IF(p_case_type='Clinical','CLN','PM'),'-',YEAR(p_incident_date),'-',LPAD(v_patient_id,5,'0'));
    INSERT INTO medico_legal_cases(case_number,patient_id,case_type,incident_date,incident_location,police_station,description,assigned_staff_id)
    VALUES(v_case_number,v_patient_id,p_case_type,p_incident_date,p_incident_location,p_police_station,p_description,p_assigned_staff_id);
  COMMIT;
  SELECT v_patient_id AS patient_id, LAST_INSERT_ID() AS case_id, v_case_number AS case_number;
END$$

CREATE PROCEDURE sp_transfer_evidence(
  IN p_evidence_id INT, IN p_from_staff_id INT, IN p_to_staff_id INT,
  IN p_transfer_date DATETIME, IN p_purpose VARCHAR(255), IN p_remarks TEXT,
  IN p_new_status VARCHAR(30)
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN ROLLBACK; RESIGNAL; END;
  IF p_from_staff_id IS NULL AND p_to_staff_id IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='At least one custodian is required';
  END IF;
  START TRANSACTION;
    INSERT INTO chain_of_custody(evidence_id,from_staff_id,to_staff_id,transfer_date,purpose,remarks)
    VALUES(p_evidence_id,p_from_staff_id,p_to_staff_id,COALESCE(p_transfer_date,NOW()),p_purpose,p_remarks);
    UPDATE evidence SET current_status=p_new_status WHERE evidence_id=p_evidence_id;
    IF ROW_COUNT()=0 THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Evidence not found'; END IF;
  COMMIT;
END$$

CREATE PROCEDURE sp_complete_laboratory_test(
  IN p_test_id INT, IN p_result TEXT, IN p_tested_by INT, IN p_test_date DATE
)
BEGIN
  IF p_result IS NULL OR TRIM(p_result)='' THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='A result is required'; END IF;
  UPDATE laboratory_tests
  SET result=p_result, tested_by=p_tested_by, test_date=COALESCE(p_test_date,CURRENT_DATE), status='Completed'
  WHERE test_id=p_test_id AND status='Pending';
  IF ROW_COUNT()=0 THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Pending laboratory test not found'; END IF;
END$$

CREATE TRIGGER trg_case_before_insert
BEFORE INSERT ON medico_legal_cases FOR EACH ROW
BEGIN
  IF NEW.incident_date > CURRENT_DATE THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Incident date cannot be in the future'; END IF;
END$$

CREATE TRIGGER trg_report_before_update
BEFORE UPDATE ON court_reports FOR EACH ROW
BEGIN
  IF NEW.status IN ('Submitted','Approved') AND (NEW.submission_date IS NULL OR NEW.court_name IS NULL) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Submitted reports require a submission date and court name';
  END IF;
END$$

CREATE TRIGGER trg_evidence_after_insert
AFTER INSERT ON evidence FOR EACH ROW
BEGIN
  INSERT INTO chain_of_custody(evidence_id,from_staff_id,to_staff_id,transfer_date,purpose,remarks)
  VALUES(NEW.evidence_id,NULL,NEW.collected_by,NOW(),'Initial collection',CONCAT('Stored at ',NEW.storage_location));
END$$

CREATE TRIGGER trg_case_audit_after_update
AFTER UPDATE ON medico_legal_cases FOR EACH ROW
BEGIN
  IF NOT (OLD.status <=> NEW.status) THEN
    INSERT INTO audit_logs(action,table_name,record_id,details)
    VALUES('STATUS_CHANGE','medico_legal_cases',NEW.case_id,CONCAT('Status changed from ',OLD.status,' to ',NEW.status));
  END IF;
END$$

DELIMITER ;
