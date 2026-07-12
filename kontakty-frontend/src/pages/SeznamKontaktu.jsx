import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getKontakty, smazKontakt, hledatKontakty } from '../api/kontakty';
import { exportKontaktyPdf, hromadnyEmail } from '../api/flask';
import { Box, Button, Container, IconButton, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Chip, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import EmailIcon from '@mui/icons-material/Email';
import TableChartIcon from '@mui/icons-material/TableChart';
import UploadIcon from '@mui/icons-material/Upload';
import BackupIcon from '@mui/icons-material/Backup';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

export default function SeznamKontaktu() {
  const [kontakty, setKontakty] = useState([]);
  const [hledani, setHledani] = useState('');
  const [emailDialog, setEmailDialog] = useState(false);
  const [emailData, setEmailData] = useState({ predmet: '', zprava: '', email: '', heslo: '' });
  const [importVysledek, setImportVysledek] = useState(null);
  const importRef = useRef();
  const pdfZCsvRef = useRef();
  const navigate = useNavigate();

  useEffect(() => { nactiKontakty(); }, []);

  const nactiKontakty = async () => {
    const res = await getKontakty();
    setKontakty(res.data);
  };

  const handleHledat = async (e) => {
    const hodnota = e.target.value;
    setHledani(hodnota);
    if (hodnota.length > 1) {
      const res = await hledatKontakty(hodnota);
      setKontakty(res.data);
    } else {
      nactiKontakty();
    }
  };

  const handleSmazat = async (id) => {
    if (window.confirm('Opravdu smazat kontakt?')) {
      await smazKontakt(id);
      nactiKontakty();
    }
  };

  const handleImportCsv = async (e) => {
    const soubor = e.target.files[0];
    if (!soubor) return;
    const formData = new FormData();
    formData.append('file', soubor);
    try {
      const res = await fetch('http://localhost:5001/api/import/csv', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setImportVysledek(data);
      setTimeout(() => setImportVysledek(null), 5000);
    } catch (e) {
      alert('Chyba při importu');
    }
    importRef.current.value = '';
  };

  const handlePdfZCsv = async (e) => {
    const soubor = e.target.files[0];
    if (!soubor) return;

    const formData = new FormData();
    formData.append('file', soubor);

    try {
      // Nejdřív importuj CSV
      const importRes = await fetch('http://localhost:5001/api/import/csv', {
        method: 'POST',
        body: formData
      });
      const importData = await importRes.json();

      if (importData.pocet === 0) {
        alert('CSV soubor neobsahuje žádné platné kontakty');
        pdfZCsvRef.current.value = '';
        return;
      }

      // Pak vygeneruj PDF
      const pdfRes = await fetch('http://localhost:5001/api/pdf/report', { method: 'POST' });
      const pdfData = await pdfRes.json();

      if (pdfData.zprava) {
        alert(`PDF vytvořeno z ${importData.pocet} kontaktů!\nUloženo: ${pdfData.cesta}`);
      } else {
        alert(`Chyba: ${pdfData.chyba}`);
      }
    } catch (e) {
      alert('Chyba při generování PDF');
    }
    pdfZCsvRef.current.value = '';
  };

  const handleZaloha = async () => {
    const res = await fetch('http://localhost:5001/api/crm/zaloha', { method: 'POST' });
    const data = await res.json();
    alert(data.zprava ? `Záloha vytvořena: ${data.cesta}` : `Chyba: ${data.chyba}`);
  };

  const handleOdeslatEmail = async () => {
    try {
      const res = await hromadnyEmail(emailData);
      alert(`Odesláno: ${res.data.odeslano} emailů`);
      setEmailDialog(false);
    } catch (e) {
      alert('Chyba při odesílání');
    }
  };

  const typBarva = (typ) => {
    const barvy = { 'Zákazník': 'primary', 'Partner': 'success', 'Dodavatel': 'warning', 'Lead': 'default' };
    return barvy[typ] || 'default';
  };

  return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={1}>
          <Typography variant="h4">Kontakty</Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            <input type="file" accept=".csv" ref={importRef} style={{ display: 'none' }} onChange={handleImportCsv} />
            <input type="file" accept=".csv" ref={pdfZCsvRef} style={{ display: 'none' }} onChange={handlePdfZCsv} />
            <Button variant="outlined" color="secondary" startIcon={<UploadIcon />} onClick={() => importRef.current.click()}>Import CSV</Button>
            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={exportKontaktyPdf}>Export PDF</Button>
            <Button variant="outlined" color="info" startIcon={<PictureAsPdfIcon />} onClick={() => pdfZCsvRef.current.click()}>PDF z CSV</Button>
            <Button variant="outlined" color="warning" startIcon={<TableChartIcon />} onClick={() => window.open('http://localhost:5001/api/crm/export/kontakty-excel', '_blank')}>Export Excel</Button>
            <Button variant="outlined" color="success" startIcon={<EmailIcon />} onClick={() => setEmailDialog(true)}>Hromadný email</Button>
            <Button variant="outlined" color="error" startIcon={<BackupIcon />} onClick={handleZaloha}>Záloha DB</Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/kontakty/novy')}>Přidat kontakt</Button>
          </Box>
        </Box>

        {importVysledek && (
            <Alert severity={importVysledek.chyby?.length ? 'warning' : 'success'} sx={{ mb: 2 }}>
              Načteno: {importVysledek.pocet} kontaktů
              {importVysledek.chyby?.length > 0 && ` | Chyby: ${importVysledek.chyby.join(', ')}`}
            </Alert>
        )}

        <TextField fullWidth placeholder="Hledat podle jména nebo emailu..." value={hledani} onChange={handleHledat} sx={{ mb: 3 }}
                   InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1976d2' }}>
                {['Jméno', 'Příjmení', 'Email', 'Telefon', 'Město', 'Pozice', 'Typ', 'Firma', 'Akce'].map(h => (
                    <TableCell key={h} sx={{ color: 'white', fontWeight: 'bold' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {kontakty.map((k) => (
                  <TableRow key={k.id} hover>
                    <TableCell>{k.jmeno}</TableCell>
                    <TableCell>{k.prijmeni}</TableCell>
                    <TableCell>{k.email}</TableCell>
                    <TableCell>{k.telefon}</TableCell>
                    <TableCell>{k.mesto}</TableCell>
                    <TableCell>{k.pozice}</TableCell>
                    <TableCell><Chip label={k.typ} color={typBarva(k.typ)} size="small" /></TableCell>
                    <TableCell>{k.firma?.nazev || 'Solo'}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => navigate(`/kontakty/${k.id}`)}><EditIcon /></IconButton>
                      <IconButton color="error" onClick={() => handleSmazat(k.id)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {emailDialog && (
            <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <Paper sx={{ p: 4, width: 420 }}>
                <Typography variant="h6" mb={2}>Hromadný email</Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  <TextField label="Váš Gmail" value={emailData.email} onChange={e => setEmailData({...emailData, email: e.target.value})} fullWidth />
                  <TextField label="App heslo" type="password" value={emailData.heslo} onChange={e => setEmailData({...emailData, heslo: e.target.value})} fullWidth />
                  <TextField label="Předmět" value={emailData.predmet} onChange={e => setEmailData({...emailData, predmet: e.target.value})} fullWidth />
                  <TextField label="Zpráva" multiline rows={4} value={emailData.zprava} onChange={e => setEmailData({...emailData, zprava: e.target.value})} fullWidth />
                  <Box display="flex" gap={2}>
                    <Button variant="outlined" onClick={() => setEmailDialog(false)}>Zrušit</Button>
                    <Button variant="contained" onClick={handleOdeslatEmail}>Odeslat</Button>
                  </Box>
                </Box>
              </Paper>
            </Box>
        )}
      </Container>
  );
}