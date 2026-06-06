import axios from 'axios';
const API = 'http://localhost:5033/api';
export const getAktivity = () => axios.get(`${API}/aktivity`);
export const getAktivityKontaktu = (id) => axios.get(`${API}/aktivity/kontakt/${id}`);
export const vytvorAktivitu = (data) => axios.post(`${API}/aktivity`, data);
export const smazAktivitu = (id) => axios.delete(`${API}/aktivity/${id}`);
