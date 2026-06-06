import axios from 'axios';
const FLASK = 'http://localhost:5001';
export const getStatistiky = () => axios.get(`${FLASK}/api/crm/statistiky`);
export const exportKontaktyPdf = () => window.open(`${FLASK}/api/crm/export/kontakty-pdf`, '_blank');
export const exportFirmyPdf = () => window.open(`${FLASK}/api/crm/export/firmy-pdf`, '_blank');
export const hromadnyEmail = (data) => axios.post(`${FLASK}/api/crm/hromadny-email`, data);
