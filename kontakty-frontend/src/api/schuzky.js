import axios from 'axios';
const API = 'http://localhost:5033/api';
export const getSchuzky = () => axios.get(`${API}/schuzky`);
export const getSchuzka = (id) => axios.get(`${API}/schuzky/${id}`);
export const vytvorSchuzku = (data) => axios.post(`${API}/schuzky`, data);
export const upravSchuzku = (id, data) => axios.put(`${API}/schuzky/${id}`, data);
export const smazSchuzku = (id) => axios.delete(`${API}/schuzky/${id}`);
