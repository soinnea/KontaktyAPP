import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getKontakt, vytvorKontakt, upravKontakt } from '../api/kontakty';
import { getFirmy } from '../api/firmy';
import { Box, Button, Container, MenuItem, Paper, TextField, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function FormularKontaktu() {
  const { id } = useParams();
  const navigate = useNavigate();
  const jeUprava = !!id;
  const [firmy, setFirmy] = useState([]);
  const [formular, setFormular] = useState({
    jmeno: '', prijmeni: '', email: '', telefon: '', mesto: '',
    pozice: '', typ: 'Zákazník', tagy: '', firmaId: ''
  });

  useEffect(() => {
    getFirmy().then(res => setFirmy(res.data));
    if (jeUprava) getKontakt(id).then(res => setFormular(res.data));
  }, [id]);

  const handleZmena = (e) => setFormular({ ...formular, [e.target.name]: e.target.value });

  const handleUlozit = async () => {
    const data = { ...formular, firmaId: formular.firmaId || null };
    if (jeUprava) await upravKontakt(id, data);
    else await vytvorKontakt(data);
    navigate('/kontakty');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" mb={3}>{jeUprava ? 'Upravit kontakt' : 'Nový kontakt'}</Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField label="Jméno" name="jmeno" value={formular.jmeno} onChange={handleZmena} fullWidth />
          <TextField label="Příjmení" name="prijmeni" value={formular.prijmeni} onChange={handleZmena} fullWidth />
          <TextField label="Email" name="email" value={formular.email} onChange={handleZmena} fullWidth />
          <TextField label="Telefon" name="telefon" value={formular.telefon} onChange={handleZmena} fullWidth />
          <TextField label="Město" name="mesto" value={formular.mesto} onChange={handleZmena} fullWidth />
          <TextField label="Pozice" name="pozice" value={formular.pozice} onChange={handleZmena} fullWidth />
          <TextField select label="Typ" name="typ" value={formular.typ} onChange={handleZmena} fullWidth>
            {['Zákazník', 'Partner', 'Dodavatel', 'Lead'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
          <TextField label="Tagy" name="tagy" value={formular.tagy} onChange={handleZmena} fullWidth />
          <TextField select label="Firma" name="firmaId" value={formular.firmaId || ''} onChange={handleZmena} fullWidth>
            <MenuItem value="">Solo podnikatel</MenuItem>
            {firmy.map(f => <MenuItem key={f.id} value={f.id}>{f.nazev}</MenuItem>)}
          </TextField>
          <Box display="flex" gap={2} mt={2}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/kontakty')}>Zpět</Button>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleUlozit}>Uložit</Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
