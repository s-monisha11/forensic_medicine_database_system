USE forensic_medicine_db;

-- Q1: Complete case register (multi-table join)
SELECT * FROM vw_case_summary ORDER BY incident_date DESC;

-- Q2: Patient history for one NIC
SELECT p.full_name, p.nic, c.case_number, c.case_type, c.incident_date, c.status
FROM patients p JOIN medico_legal_cases c ON c.patient_id=p.patient_id
WHERE p.nic='923456789V' ORDER BY c.incident_date DESC;

-- Q3: Pending workload and age
SELECT * FROM vw_pending_work ORDER BY days_open DESC;

-- Q4: Evidence and chain-of-custody transfer count
SELECT * FROM vw_evidence_register ORDER BY collected_date DESC;

-- Q5: Outstanding laboratory tests
SELECT lt.test_id,e.evidence_code,c.case_number,lt.test_type,lt.status
FROM laboratory_tests lt JOIN evidence e ON e.evidence_id=lt.evidence_id
JOIN medico_legal_cases c ON c.case_id=e.case_id WHERE lt.status='Pending';

-- Q6: Reports awaiting action
SELECT cr.report_id,c.case_number,cr.report_type,cr.court_name,cr.status,s.full_name AS prepared_by
FROM court_reports cr JOIN medico_legal_cases c ON c.case_id=cr.case_id
LEFT JOIN staff s ON s.staff_id=cr.prepared_by WHERE cr.status IN ('Draft','Pending');

-- Q7: Monthly statistical report
SELECT * FROM vw_monthly_case_statistics ORDER BY case_month DESC;

-- Q8: Workload by staff member
SELECT s.staff_id,s.full_name,s.role,COUNT(c.case_id) AS assigned_cases,
       SUM(c.status IN ('Pending','In Progress','Urgent')) AS active_cases
FROM staff s LEFT JOIN medico_legal_cases c ON c.assigned_staff_id=s.staff_id
GROUP BY s.staff_id,s.full_name,s.role ORDER BY active_cases DESC;

-- Q9: Cause-of-death distribution
SELECT cause_of_death,COUNT(*) AS total FROM postmortems
WHERE cause_of_death IS NOT NULL GROUP BY cause_of_death ORDER BY total DESC;

-- Q10: Full-text-style operational search using indexed identifiers
SET @search_term='Colombo';
SELECT c.case_number,p.full_name,p.nic,c.police_station,c.status
FROM medico_legal_cases c JOIN patients p ON p.patient_id=c.patient_id
WHERE c.case_number LIKE CONCAT('%',@search_term,'%')
   OR p.full_name LIKE CONCAT('%',@search_term,'%')
   OR p.nic LIKE CONCAT('%',@search_term,'%')
   OR c.police_station LIKE CONCAT('%',@search_term,'%');
