import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import EventIcon from '@mui/icons-material/Event';

export default function Navigace() {
  const navigate = useNavigate();
  const location = useLocation();

  const polozky = [
    { label: 'Dashboard', cesta: '/', icon: <DashboardIcon /> },
    { label: 'Kontakty', cesta: '/kontakty', icon: <PeopleIcon /> },
    { label: 'Firmy', cesta: '/firmy', icon: <BusinessIcon /> },
    { label: 'Schůzky', cesta: '/schuzky', icon: <EventIcon /> },
  ];

  return (
    <AppBar position="static" sx={{ backgroundColor: '#222E50' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ mr: 4, fontWeight: 'bold' }}>CRM Systém</Typography>
        <Box display="flex" gap={1}>
          {polozky.map(p => (
            <Button
              key={p.cesta}
              color="inherit"
              startIcon={p.icon}
              onClick={() => navigate(p.cesta)}
              sx={{ backgroundColor: location.pathname === p.cesta ? 'rgba(255,255,255,0.2)' : 'transparent' }}
            >
              {p.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
