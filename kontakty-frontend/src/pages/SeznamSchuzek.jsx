import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSchuzky, smazSchuzku } from '../api/schuzky';
import { Box, Button, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

export default function SeznamSchuzek() {
  const [schuzky, setSchuzky] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { nactiSchuzky(); }, []);

  const nactiSchuzky = async () => {
    const res = await getSchuzky();
    setSchuzky(res.data);
  };

  const handleSmazat = async (id) => {
    if (window.confirm('Opravdu smazat schůzku?')) {
      await smazSchuzku(id);
      nactiSchuzky();
    }
  };

  const stavBarva = (stav) => {
    const barvy = { 'Naplánovaná': 'primary', 'Proběhla': 'success', 'Zrušená': 'error' };
    return barvy[stav] || 'default';
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Schůzky</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/schuzky/nova')}>Přidat schůzku</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1976d2' }}>
              {['Název', 'Datum', 'Místo', 'Stav', 'Kontakt', 'Firma', 'Akce'].map(h => (
                <TableCell key={h} sx={{ color: 'white', fontWeight: 'bold' }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {schuzky.map((s) => (
              <TableRow key={s.id} hover>
                <TableCell>{s.nazev}</TableCell>
                <TableCell>{new Date(s.datum).toLocaleDateString('cs-CZ')}</TableCell>
                <TableCell>{s.misto}</TableCell>
                <TableCell><Chip label={s.stav} color={stavBarva(s.stav)} size="small" /></TableCell>
                <TableCell>{s.kontakt ? `${s.kontakt.jmeno} ${s.kontakt.prijmeni}` : '-'}</TableCell>
                <TableCell>{s.firma?.nazev || '-'}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => navigate(`/schuzky/${s.id}`)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleSmazat(s.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
