import React, { useState, useRef, useEffect } from 'react';
import Navbar from './Navbar'; // Importar el componente Navbar
import Drawer from '@material-ui/core/Drawer';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Footer from './Footer'; // Importar el componente Footer
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import img1 from './prof.png';
import { useNavigate } from 'react-router-dom';
const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 250,
  },
  drawerPaper: {
    width: 250,
  },
  card: {
    marginBottom: theme.spacing(3),
  },
}));

function Dashboard(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null); // Referencia al elemento del menú lateral

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    // Función que maneja los clics fuera del menú
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && menuOpen) {
        setMenuOpen(false);
      }
    };

    // Agregamos el manejador de eventos al documento para detectar clics fuera del menú
    document.addEventListener('mousedown', handleClickOutside);

    // Limpiamos el manejador de eventos al desmontar el componente
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]); // Dependencia para que se actualice cuando el menú cambia de estado

  const handleRegistrarNotas = () => {
    navigate('/registrar-nota');
  }
  return (
    <div>
      {/* Navbar */}
      <Navbar handleMenuToggle={handleMenuToggle} />

      {/* Sidebar */}
      <Drawer
        className={classes.drawer}
        ref={menuRef}
        variant="persistent"
        anchor="left"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div>
          {/* Contenido del Sidebar */}
          <MenuItem>Registrar asistencia</MenuItem>
          <MenuItem onClick={handleRegistrarNotas}>Registrar notas</MenuItem>
          <MenuItem>Ver reclamos</MenuItem>
        </div>
      </Drawer>

      {/* Main Content */}
      <Container>
        <br />
        <br />
        {/* Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Card className={classes.card}>
              <CardMedia
                component="img"
                alt="Imagen"
                height="300"
                image={img1}
                title="mascota1"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Bienvenido, Prof Hugo Venga
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Docente en la Universidad Nacional Mayor de San Marcos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Dashboard;


