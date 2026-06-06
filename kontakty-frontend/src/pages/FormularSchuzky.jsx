import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSchuzka, vytvorSchuzku, upravSchuzku } from '../api/schuzky';
import { getKontakty } from '../api/kontakty';
import { getFirmy } from '../api/firmy';
import { Box, Button, Container, MenuItem, Paper, TextField, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function FormularSchuzky() {
  const { id } = useParams();
  const navigate = useNavigate();
  const jeUprava = !!id;
  const [kontakty, setKontakty] = useState([]);
  const [firmy, setFirmy] = useState([]);
  const [formular, setFormular] = useState({
    nazev: '', popis: '', datum: '', misto: '', stav: 'Naplánovaná', kontaktId: '', firmaId: ''
  });

  useEffect(() => {
    getKontakty().then(res => setKontakty(res.data));
    getFirmy().then(res => setFirmy(res.data));
    if (jeUprava) getSchuzka(id).then(res => {
      const s = res.data;
      setFormular({ ...s, datum: s.datum?.slice(0, 16) || '', kontaktId: s.kontaktId || '', firmaId: s.firmaId || '' });
    });
  }, [id]);

  const handleZmena = (e) => setFormular({ ...formular, [e.target.name]: e.target.value });

  const handleUlozit = async () => {
    const data = { ...formular, kontaktId: formular.kontaktId || null, firmaId: formular.firmaId || null };
    if (jeUprava) await upravSchuzku(id, data);
    else await vytvorSchuzku(data);
    navigate('/schuzky');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" mb={3}>{jeUprava ? 'Upravit schůzku' : 'Nová schůzka'}</Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField label="Název" name="nazev" value={formular.nazev} onChange={handleZmena} fullWidth />
          <TextField label="Popis" name="popis" value={formular.popis} onChange={handleZmena} multiline rows={3} fullWidth />
          <TextField label="Datum" name="datum" type="datetime-local" value={formular.datum} onChange={handleZmena} fullWidth InputLabelProps={{ shrink: true }} />
          <TextField label="Místo" name="misto" value={formular.misto} onChange={handleZmena} fullWidth />
          <TextField select label="Stav" name="stav" value={formular.stav} onChange={handleZmena} fullWidth>
            {['Naplánovaná', 'Proběhla', 'Zrušená'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
          <TextField select label="Kontakt" name="kontaktId" value={formular.kontaktId || ''} onChange={handleZmena} fullWidth>
            <MenuItem value="">Bez kontaktu</MenuItem>
            {kontakty.map(k => <MenuItem key={k.id} value={k.id}>{k.jmeno} {k.prijmeni}</MenuItem>)}
          </TextField>
          <TextField select label="Firma" name="firmaId" value={formular.firmaId || ''} onChange={handleZmena} fullWidth>
            <MenuItem value="">Bez firmy</MenuItem>
            {firmy.map(f => <MenuItem key={f.id} value={f.id}>{f.nazev}</MenuItem>)}
          </TextField>
          <Box display="flex" gap={2} mt={2}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/schuzky')}>Zpět</Button>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleUlozit}>Uložit</Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
