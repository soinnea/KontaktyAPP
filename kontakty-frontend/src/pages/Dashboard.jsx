import { useEffect, useState } from 'react';
import { getStatistiky } from '../api/flask';
import { Box, Card, CardContent, Container, Grid, Typography, CircularProgress } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import EventIcon from '@mui/icons-material/Event';
import TimelineIcon from '@mui/icons-material/Timeline';

export default function Dashboard() {
  const [statistiky, setStatistiky] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStatistiky()
      .then(res => setStatistiky(res.data))
      .catch(() => setStatistiky(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

  const karty = [
    { label: 'Kontakty', hodnota: statistiky?.celkem?.kontakty || 0, icon: <PeopleIcon fontSize="large" />, barva: '#1976d2' },
    { label: 'Firmy', hodnota: statistiky?.celkem?.firmy || 0, icon: <BusinessIcon fontSize="large" />, barva: '#388e3c' },
    { label: 'Schůzky', hodnota: statistiky?.celkem?.schuzky || 0, icon: <EventIcon fontSize="large" />, barva: '#f57c00' },
    { label: 'Aktivity', hodnota: statistiky?.celkem?.aktivity || 0, icon: <TimelineIcon fontSize="large" />, barva: '#7b1fa2' },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" mb={4}>Dashboard</Typography>

      <Grid container spacing={3} mb={4}>
        {karty.map((k) => (
          <Grid item xs={12} sm={6} md={3} key={k.label}>
            <Card sx={{ borderLeft: `5px solid ${k.barva}` }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="textSecondary" variant="body2">{k.label}</Typography>
                    <Typography variant="h3" fontWeight="bold">{k.hodnota}</Typography>
                  </Box>
                  <Box sx={{ color: k.barva }}>{k.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {statistiky && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" mb={2}>Kontakty podle typu</Typography>
                {statistiky.kontakty_podle_typu?.map(r => (
                  <Box key={r.Typ} display="flex" justifyContent="space-between" py={0.5} borderBottom="1px solid #eee">
                    <Typography>{r.Typ || 'Nezadáno'}</Typography>
                    <Typography fontWeight="bold">{r.pocet}</Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" mb={2}>Firmy podle segmentu</Typography>
                {statistiky.firmy_podle_segmentu?.map(r => (
                  <Box key={r.Segment} display="flex" justifyContent="space-between" py={0.5} borderBottom="1px solid #eee">
                    <Typography>{r.Segment || 'Nezadáno'}</Typography>
                    <Typography fontWeight="bold">{r.pocet}</Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" mb={2}>Schůzky podle stavu</Typography>
                {statistiky.schuzky_podle_stavu?.map(r => (
                  <Box key={r.Stav} display="flex" justifyContent="space-between" py={0.5} borderBottom="1px solid #eee">
                    <Typography>{r.Stav}</Typography>
                    <Typography fontWeight="bold">{r.pocet}</Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" mb={2}>Top 10 měst</Typography>
                {statistiky.kontakty_podle_mesta?.map(r => (
                  <Box key={r.Mesto} display="flex" justifyContent="space-between" py={0.5} borderBottom="1px solid #eee">
                    <Typography>{r.Mesto}</Typography>
                    <Typography fontWeight="bold">{r.pocet}</Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" mb={2}>Aktivity podle typu</Typography>
                {statistiky.aktivity_podle_typu?.map(r => (
                  <Box key={r.Typ} display="flex" justifyContent="space-between" py={0.5} borderBottom="1px solid #eee">
                    <Typography>{r.Typ}</Typography>
                    <Typography fontWeight="bold">{r.pocet}</Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {!statistiky && (
        <Card sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
          <Typography>Dashboard statistiky nejsou dostupné – spusť Flask server na portu 5001</Typography>
        </Card>
      )}
    </Container>
  );
}
