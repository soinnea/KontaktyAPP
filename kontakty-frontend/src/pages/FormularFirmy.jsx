import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFirma, vytvorFirmu, upravFirmu } from '../api/firmy';
import { Box, Button, Container, MenuItem, Paper, TextField, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function FormularFirmy() {
  const { id } = useParams();
  const navigate = useNavigate();
  const jeUprava = !!id;
  const [formular, setFormular] = useState({
    nazev: '', email: '', telefon: '', mesto: '', adresa: '', ico: '', web: '', segment: 'B2B', tagy: ''
  });

  useEffect(() => {
    if (jeUprava) getFirma(id).then(res => setFormular(res.data));
  }, [id]);

  const handleZmena = (e) => setFormular({ ...formular, [e.target.name]: e.target.value });

  const handleUlozit = async () => {
    if (jeUprava) await upravFirmu(id, formular);
    else await vytvorFirmu(formular);
    navigate('/firmy');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" mb={3}>{jeUprava ? 'Upravit firmu' : 'Nová firma'}</Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField label="Název" name="nazev" value={formular.nazev} onChange={handleZmena} fullWidth />
          <TextField label="Email" name="email" value={formular.email} onChange={handleZmena} fullWidth />
          <TextField label="Telefon" name="telefon" value={formular.telefon} onChange={handleZmena} fullWidth />
          <TextField label="Město" name="mesto" value={formular.mesto} onChange={handleZmena} fullWidth />
          <TextField label="Adresa" name="adresa" value={formular.adresa} onChange={handleZmena} fullWidth />
          <TextField label="IČO" name="ico" value={formular.ico} onChange={handleZmena} fullWidth />
          <TextField label="Web" name="web" value={formular.web} onChange={handleZmena} fullWidth />
          <TextField select label="Segment" name="segment" value={formular.segment} onChange={handleZmena} fullWidth>
            {['B2B', 'B2C', 'Startup', 'Enterprise'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
          <TextField label="Tagy" name="tagy" value={formular.tagy} onChange={handleZmena} fullWidth />
          <Box display="flex" gap={2} mt={2}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/firmy')}>Zpět</Button>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleUlozit}>Uložit</Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
