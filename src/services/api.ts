const API_BASE_URL = '/api';

export async function apiRequest(path: string, options: RequestInit = {}) {
  const token = sessionStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
}

export const api = {
  // Auth
  login: (payload: { username: string; password: string; role: string }) =>
    apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  signup: (payload: { fullName: string; email: string; phone: string; role: string; username: string; password: string }) =>
    apiRequest('/auth/signup', { method: 'POST', body: JSON.stringify(payload) }),

  // Patients
  getPatients: () => apiRequest('/patients'),
  addPatient: (payload: Record<string, unknown>) =>
    apiRequest('/patients', { method: 'POST', body: JSON.stringify(payload) }),
  updatePatient: (id: number, payload: Record<string, unknown>) =>
    apiRequest(`/patients/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deletePatient: (id: number) =>
    apiRequest(`/patients/${id}`, { method: 'DELETE' }),

  // Cases
  getCases: () => apiRequest('/cases'),
  addCase: (payload: Record<string, unknown>) =>
    apiRequest('/cases', { method: 'POST', body: JSON.stringify(payload) }),
  updateCase: (id: number, payload: Record<string, unknown>) =>
    apiRequest(`/cases/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteCase: (id: number) =>
    apiRequest(`/cases/${id}`, { method: 'DELETE' }),
  searchCases: (params: Record<string, string>) => {
    const qs = new URLSearchParams(params).toString();
    return apiRequest(`/cases/search?${qs}`);
  },

  // Postmortems
  getPostmortems: () => apiRequest('/postmortems'),
  addPostmortem: (payload: Record<string, unknown>) =>
    apiRequest('/postmortems', { method: 'POST', body: JSON.stringify(payload) }),
  updatePostmortem: (id: number, payload: Record<string, unknown>) =>
    apiRequest(`/postmortems/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deletePostmortem: (id: number) =>
    apiRequest(`/postmortems/${id}`, { method: 'DELETE' }),

  // Clinical Examinations
  getClinicalExams: () => apiRequest('/clinical'),
  addClinicalExam: (payload: Record<string, unknown>) =>
    apiRequest('/clinical', { method: 'POST', body: JSON.stringify(payload) }),
  updateClinicalExam: (id: number, payload: Record<string, unknown>) =>
    apiRequest(`/clinical/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteClinicalExam: (id: number) =>
    apiRequest(`/clinical/${id}`, { method: 'DELETE' }),

  // Evidence
  getEvidence: () => apiRequest('/evidence'),
  addEvidence: (payload: Record<string, unknown>) =>
    apiRequest('/evidence', { method: 'POST', body: JSON.stringify(payload) }),
  updateEvidence: (id: number, payload: Record<string, unknown>) =>
    apiRequest(`/evidence/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteEvidence: (id: number) =>
    apiRequest(`/evidence/${id}`, { method: 'DELETE' }),
  getChainOfCustody: (evidenceId: number) =>
    apiRequest(`/evidence/${evidenceId}/chain-of-custody`),
  addChainOfCustody: (evidenceId: number, payload: Record<string, unknown>) =>
    apiRequest(`/evidence/${evidenceId}/chain-of-custody`, { method: 'POST', body: JSON.stringify(payload) }),

  // Laboratory tests
  getLaboratoryTests: () => apiRequest('/laboratory-tests'),
  addLaboratoryTest: (payload: Record<string, unknown>) =>
    apiRequest('/laboratory-tests', { method: 'POST', body: JSON.stringify(payload) }),
  updateLaboratoryTest: (id: number, payload: Record<string, unknown>) =>
    apiRequest(`/laboratory-tests/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteLaboratoryTest: (id: number) =>
    apiRequest(`/laboratory-tests/${id}`, { method: 'DELETE' }),

  // Reports
  getReports: () => apiRequest('/reports'),
  getPendingReports: () => apiRequest('/reports/pending'),
  getMonthlyStats: () => apiRequest('/reports/monthly'),
  addReport: (payload: Record<string, unknown>) =>
    apiRequest('/reports', { method: 'POST', body: JSON.stringify(payload) }),
  updateReport: (id: number, payload: Record<string, unknown>) =>
    apiRequest(`/reports/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteReport: (id: number) =>
    apiRequest(`/reports/${id}`, { method: 'DELETE' }),

  // Staff
  getStaff: () => apiRequest('/staff'),
  addStaff: (payload: Record<string, unknown>) =>
    apiRequest('/staff', { method: 'POST', body: JSON.stringify(payload) }),
  updateStaff: (id: number, payload: Record<string, unknown>) =>
    apiRequest(`/staff/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteStaff: (id: number) =>
    apiRequest(`/staff/${id}`, { method: 'DELETE' }),

  // Dashboard
  getDashboardStats: () => apiRequest('/dashboard/stats'),
};
