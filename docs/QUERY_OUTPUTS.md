# Demonstration Query Outputs

These are the expected key results after running `database.sql`, followed by `sql/02_advanced_objects.sql` and `sql/03_required_queries.sql`. Capture the same result grids in MySQL Workbench for the final report.

## Case summary

| Case number | Type | Patient | Police station | Status |
|---|---|---|---|---|
| PM-2026-003 | Autopsy | N.P. Gunasekara | Matara Police | Pending |
| CLN-2026-003 | Clinical | A.S. Perera | Colombo South | Completed |
| PM-2026-002 | Autopsy | R.P. Wickramasinghe | Colombo Central | Urgent |
| CLN-2026-002 | Clinical | S.A. Wijesuriya | Galle Police | In Progress |
| PM-2026-001 | Autopsy | K.D. Fernando | Kandy Police | In Progress |
| CLN-2026-001 | Clinical | W.M. Silva | Colombo Central | Pending |

## Patient history (`923456789V`)

| Patient | NIC | Case number | Type | Incident date | Status |
|---|---|---|---|---|---|
| W.M. Silva | 923456789V | CLN-2026-001 | Clinical | 2026-06-20 | Pending |

## Outstanding laboratory tests

| Test ID | Evidence code | Case number | Test type | Status |
|---:|---|---|---|---|
| 2 | EV-2026-002 | PM-2026-001 | Trace Fibre Analysis | Pending |
| 3 | EV-2026-003 | CLN-2026-002 | Toxicology Screening | Pending |

## Monthly statistics

| Month | Clinical | Autopsy | Total | Open | Completed |
|---|---:|---:|---:|---:|---:|
| 2026-06 | 3 | 3 | 6 | 5 | 1 |

## Pending court-report queue

| Case number | Report type | Court | Status |
|---|---|---|---|
| PM-2026-002 | Postmortem | Colombo High Court | Draft |
| PM-2026-001 | Postmortem | Kandy High Court | Draft |
| CLN-2026-001 | Clinical Examination | Colombo Magistrate Court | Pending |

The remaining outputs—evidence register, staff workload, cause-of-death distribution, and parameterized search—are generated directly by the labeled statements in `03_required_queries.sql`.
