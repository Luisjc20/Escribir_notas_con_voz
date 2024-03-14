import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh', // Establece la altura mínima de la página para ocupar toda la ventana
  },
  content: {
    flexGrow: 1, // Hace que el contenido ocupe el espacio disponible
    padding: theme.spacing(3),
  },
  footer: {
    backgroundColor: '#e6f2ff', // Color celeste claro suave
    padding: theme.spacing(3),
    marginTop: 'auto', // Empuja el footer hacia la parte inferior
  },
}));

function Footer() {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Typography variant="body1" align="center" color="textSecondary">
        © {new Date().getFullYear()} Sistema educativo. Todos los derechos reservados.
      </Typography>
    </footer>
  );
}

export default function Layout({ children }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <main className={classes.content}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

