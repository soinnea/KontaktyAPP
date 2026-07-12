import axios from 'axios';
const API = 'http://localhost:5033/api';
export const getFirmy = () => axios.get(`${API}/firmy`);
export const getFirma = (id) => axios.get(`${API}/firmy/${id}`);
export const vytvorFirmu = (data) => axios.post(`${API}/firmy`, data);
export const upravFirmu = (id, data) => axios.put(`${API}/firmy/${id}`, data);
export const smazFirmu = (id) => axios.delete(`${API}/firmy/${id}`);
