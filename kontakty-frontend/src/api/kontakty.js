import axios from 'axios';
const API = 'http://localhost:5033/api';
export const getKontakty = () => axios.get(`${API}/kontakty`);
export const getKontakt = (id) => axios.get(`${API}/kontakty/${id}`);
export const vytvorKontakt = (data) => axios.post(`${API}/kontakty`, data);
export const upravKontakt = (id, data) => axios.put(`${API}/kontakty/${id}`, data);
export const smazKontakt = (id) => axios.delete(`${API}/kontakty/${id}`);
export const hledatKontakty = (dotaz) => axios.get(`${API}/kontakty/hledat?dotaz=${dotaz}`);
