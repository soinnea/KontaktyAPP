import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirmy, smazFirmu } from '../api/firmy';
import { exportFirmyPdf } from '../api/flask';
import { Box, Button, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';

export default function SeznamFirem() {
  const [firmy, setFirmy] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { nactiFiremy(); }, []);

  const nactiFiremy = async () => {
    const res = await getFirmy();
    setFirmy(res.data);
  };

  const handleSmazat = async (id) => {
    if (window.confirm('Opravdu smazat firmu?')) {
      await smazFirmu(id);
      nactiFiremy();
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Firmy</Typography>
        <Box display="flex" gap={1}>
          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={exportFirmyPdf}>Export PDF</Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/firmy/nova')}>Přidat firmu</Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1976d2' }}>
              {['Název', 'Email', 'Telefon', 'Město', 'IČO', 'Segment', 'Kontaktů', 'Akce'].map(h => (
                <TableCell key={h} sx={{ color: 'white', fontWeight: 'bold' }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {firmy.map((f) => (
              <TableRow key={f.id} hover>
                <TableCell>{f.nazev}</TableCell>
                <TableCell>{f.email}</TableCell>
                <TableCell>{f.telefon}</TableCell>
                <TableCell>{f.mesto}</TableCell>
                <TableCell>{f.ico}</TableCell>
                <TableCell><Chip label={f.segment} size="small" color="primary" /></TableCell>
                <TableCell>{f.kontakty?.length || 0}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => navigate(`/firmy/${f.id}`)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleSmazat(f.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
