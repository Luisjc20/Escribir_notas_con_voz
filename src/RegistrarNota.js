
import React, { useState, useRef, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import MenuItem from '@material-ui/core/MenuItem';
import img1 from './prof.png';
import Container from '@material-ui/core/Container';
const { webkitSpeechRecognition } = window;


const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 250,
  },
  drawerPaper: {
    width: 250,
  },
  dataTable: {
    width: '100%',
    borderCollapse: 'collapse', // Para que los bordes de las celdas se fusionen
  },
  tableHeader: {
    backgroundColor: '#f0f0f0', // Color de fondo de las celdas de encabezado
    border: '1px solid #ddd', // Borde de las celdas de encabezado
    padding: '8px',
    textAlign: 'left',
  },
  tableCell: {
    border: '1px solid #ddd', // Borde de las celdas de datos
    padding: '8px',
    textAlign: 'left',
  },
}));

const RegistrarNotas = ({ onLogout }) => {
  const classes = useStyles();
  useEffect(() => {
    llenarTabla();
    iniciarReconocimiento();
}, []);

let recognition;

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && menuOpen) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);
  
 
    let data = [
        { nombre: 'Airton Wilson', apellido: 'Collachagua', codigo: '001', celular: '123456789', correo: 'collachagua@unmsm.edu.pe', nota1: 15, nota2: 12, nota3: 18 },
        { nombre: 'Jesus Ernesto', apellido: 'Condor', codigo: '002', celular: '987654321', correo: 'condor@unmsm.edu.pe', nota1: 10, nota2: 8, nota3: 14 },
        { nombre: 'Wilfredo', apellido: 'Guía', codigo: '003', celular: '111222333', correo: 'guia@unmsm.edu.pe', nota1: 18, nota2: 17, nota3: 16 },
        { nombre: 'Joaquín Enrique', apellido: 'Hidalgo', codigo: '004', celular: '333444555', correo: 'hidalgo@unmsm.edu.pe', nota1: 12, nota2: 15, nota3: 13 },
        { nombre: 'Keler', apellido: 'Modesto', codigo: '005', celular: '555666777', correo: 'modesto@unmsm.edu.pe', nota1: 14, nota2: 10, nota3: 16 }
    ];
   
  const llenarTabla = () => {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = ''; // Limpiar contenido previo
    data.forEach((item, index) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.nombre}</td>
            <td>${item.apellido}</td>
            <td>${item.codigo}</td>
            <td>${item.celular}</td>
            <td>${item.correo}</td>
            <td><input type="number" value="${item.nota1}" class="nota" data-fila="${index}" data-indice="1"></td>
            <td><input type="number" value="${item.nota2}" class="nota" data-fila="${index}" data-indice="2"></td>
            <td><input type="number" value="${item.nota3}" class="nota" data-fila="${index}" data-indice="3"></td>
            <td>${calcularPromedio(item)}</td>
        `;
        tbody.appendChild(fila);
    });

    // Agregar evento para actualizar los datos cuando cambie el valor de una nota
    const notasInput = document.querySelectorAll('.nota');
    notasInput.forEach(input => {
        input.addEventListener('change', actualizarNota);
    });
}
const calcularPromedio = (nota1, nota2, nota3) => {
  const notas = [nota1, nota2, nota3].filter(nota => !isNaN(nota));
  const promedio = notas.length > 0 ? (notas.reduce((total, nota) => total + nota, 0) / notas.length).toFixed(2) : '';
  return promedio;
}
const actualizarNota = (event) => {
  const fila = event.target.dataset.fila;
  const indice = event.target.dataset.indice;
  const valor = parseInt(event.target.value);
  if (!isNaN(valor)) {
      data[fila][`nota${indice}`] = valor;
      llenarTabla(); // Actualizar la tabla con los cambios
  } else {
      alert('Ingrese un valor numérico válido.');
  }
}

  const activationKeyword = 'jarvis';
  const iniciarReconocimiento = () => {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'es-ES';
    recognition.interimResult = false;

    recognition.onstart = () => {
        console.log("Reconocimiento de voz iniciado");
    };

    recognition.onend = () => {
        console.log("Reconocimiento de voz detenido");
    };

    recognition.onerror = (event) => {
        console.error("Error en reconocimiento de voz:", event.error);
        iniciarReconocimiento(); // Reiniciar el reconocimiento en caso de error
    };

    recognition.onresult = (event) => {
        const ultimoResultado = event.results[event.results.length - 1][0].transcript.toLowerCase();
        console.log("Texto reconocido:", ultimoResultado);

        if (ultimoResultado.includes('jarvis')) {
            console.log('Hola señor Luis, ¿En qué fila desea editar notas?');
            leerTexto('Hola señor Luis, ¿En qué fila desea editar notas?');
        } else if (ultimoResultado.includes('fila')) {
            const matches = ultimoResultado.match(/fila (\d+)/);
            if (matches && matches.length > 1) {
                const fila = parseInt(matches[1]);
                if (fila >= 1 && fila <= 5) {
                    data[fila - 1].nota1 = '';
                    data[fila - 1].nota2 = '';
                    data[fila - 1].nota3 = '';
                    console.log('Notas de la fila ' + fila + ' borradas.');
                    leerTexto('Notas de la fila ' + fila + ' borradas.');
                    llenarTabla(); // Actualizar la tabla con los cambios
                    dictarNotas(fila);
                } else {
                    console.log('Error, fila fuera de rango.');
                    leerTexto('Error, fila fuera de rango.');
                }
            }
        } else if (ultimoResultado.includes('dicteme las notas')) {
            dictarNotas();
        }
    };

    recognition.start();
}
const handleEdit = (index, nota, value) => {
  data[index][nota] = parseInt(value);
  llenarTabla();
}
const leerTexto = (text) => {
  const speech = new SpeechSynthesisUtterance(text);
  speech.volume = 1;
  speech.rate = 1;
  speech.pitch = 1;
  speech.lang = 'es-ES';
  window.speechSynthesis.speak(speech);
}

const numeroEnPalabras = (numero) => {
  const unidades = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    const especiales = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
    const decenas = ['veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    const centenas = ['cien', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

    if (numero < 10) {
        return unidades[numero];
    } else if (numero < 20) {
        return especiales[numero - 10];
    } else if (numero < 100) {
        const decena = Math.floor(numero / 10);
        const unidad = numero % 10;
        if (unidad === 0) {
            return decenas[decena - 2];
        } else {
            return decenas[decena - 2] + ' y ' + unidades[unidad];
        }
    } else if (numero === 100) {
        return 'cien';
    } else {
        const centena = Math.floor(numero / 100);
        const resto = numero % 100;
        if (resto === 0) {
            return centenas[centena - 1];
        } else {
            return centenas[centena - 1] + ' ' + numeroEnPalabras(resto);
        }
    }
}

const dictarNotas = (fila) => {
  let notaIndex = 0;
  let notasDictadas = [];
const dictarNotaActual = () => {
  if((notaIndex + 1)===1){
      console.log('Dicteme la nota de la evaluación continua :');
  leerTexto('Dicteme la nota de la evaluación continua :');
  }else if((notaIndex + 1)===2){
      console.log('Dicteme la nota de la evaluación parcial:');
      leerTexto('Dicteme la nota de la evaluación parcial:');   
  }else if((notaIndex + 1)===3){
  console.log('Dicteme la nota de la evaluación final:');
  leerTexto('Dicteme la nota de la evaluación final:');
  }
  recognition.onresult = (event) => {
      const ultimoResultado = event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log("Texto reconocido:", ultimoResultado);
      
      // Utilizar una expresión regular para buscar números en el texto
      const numerosEncontrados = ultimoResultado.match(/\d+/g);
      
      // Verificar si se encontraron números y tomar el primero
      const nota = numerosEncontrados ? parseInt(numerosEncontrados[0]) : NaN;
      
     
      
      if (!isNaN(nota) && nota >= 0 && nota <= 20) {
          notasDictadas.push(nota);
          const currentRow = parseInt(notasDictadas.length / 3); // Calcular la fila actual
          const currentCell = document.querySelector(`#dataTable tbody tr:nth-child(${currentRow + 1}) td:nth-child(${notaIndex + 7})`);
          currentCell.textContent = nota; // Escribir la nota en la celda correspondiente
          
         // Verificar si la fila existe en 'data'
         
          
          // Verificar si el objeto 'data[fila]' está definido antes de asignar la nota
          if (data[fila-1]) {
              // Actualizar los datos en el arreglo 'data'
              const indiceNota = notaIndex + 1; // Obtener el índice de la nota (1, 2 o 3)
              if (indiceNota === 1) {
                  data[fila-1].nota1 = nota;
                  console.log('Se registró la nota' + nota  + ' en la fila '+fila-1);
                  leerTexto('Se registró la nota' + nota  + ' en la fila '+fila-1);
              } else if (indiceNota === 2) {
                  data[fila-1].nota2 = nota;
                  console.log('Se registró la nota' + nota  + ' en la fila '+fila-1);
                  leerTexto('Se registró la nota' + nota  + ' en la fila '+fila-1);
              } else {
                  data[fila-1].nota3 = nota;
                  console.log('Se registró la nota' + nota  + ' en la fila '+fila-1);
                  leerTexto('Se registró la nota' + nota  + ' en la fila '+fila-1);
              }
          } else {
              console.log('La fila ' + fila-1  + ' no está definida en la tabla');
              leerTexto('La fila ' + fila-1  + ' no está definida en la tabla');
          }
          
          notaIndex++;
          llenarTabla(); // Actualizar la tabla con las notas ingresadas
          if (notaIndex < 3) {
              dictarNotaActual(); // Dictar la siguiente nota
          } else {
              // Calcular promedio
              const promedioNumerico = (notasDictadas.reduce((total, nota) => total + nota, 0) / notasDictadas.length).toFixed(2);
              const promedioPalabras = promedioNumerico.split('.').map(numero => numeroEnPalabras(parseInt(numero))).join(' punto ');
              leerTexto('Se ha registrado exitosamente las notas.');
              console.log('El promedio es: ' + promedioPalabras);
              leerTexto('El promedio es: ' + promedioPalabras);
              leerTexto('Ha sido un gusto ayudarlo, señor Luis');
              recognition.stop(); // Detener el reconocimiento después de dictar las notas
              llenarTabla(); // Actualizar la tabla con las notas ingresadas
          }
      } else {
          console.log('Error, la nota debe ser un número entre 0 y 20.');
          leerTexto('Error, la nota debe ser un número entre 0 y 20. Por favor, inténtelo de nuevo.');
          dictarNotaActual(); // Volver a pedir la misma nota
      };
  };
};


  
  

  dictarNotaActual(); // Comenzar a dictar la primera nota
}

  // Función para renderizar la fila de la tabla
  const renderRow = (item, index) => (
    <tr key={index}>
        <td>{index + 1}</td>
        <td>{item.nombre}</td>
        <td>{item.apellido}</td>
        <td>{item.codigo}</td>
        <td>{item.celular}</td>
        <td>{item.correo}</td>
        <td>
            <input
                style={{ color: item.nota1 <= 10 ? 'red' : 'inherit' }}
                type="number"
                value={item.nota1}
                min={0}
                max={20}
                onChange={(e) => handleEdit(index, 'nota1', e.target.value)}
            />
        </td>
        <td>
            <input
                style={{ color: item.nota2 <= 10 ? 'red' : 'inherit' }}
                type="number"
                value={item.nota2}
                min={0}
                max={20}
                onChange={(e) => handleEdit(index, 'nota2', e.target.value)}
            />
        </td>
        <td>
            <input
                style={{ color: item.nota3 <= 10 ? 'red' : 'inherit' }}
                type="number"
                value={item.nota3}
                min={0}
                max={20}
                onChange={(e) => handleEdit(index, 'nota3', e.target.value)}
            />
        </td>

        <td style={{ color: calcularPromedio(item.nota1, item.nota2, item.nota3) <= 10 ? 'red' : 'inherit' }}>
            {calcularPromedio(item.nota1, item.nota2, item.nota3)}
        </td>
    </tr>
);
  return (
    <div>
      <Navbar handleMenuToggle={handleMenuToggle} />
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
          <MenuItem>Registrar asistencia</MenuItem>
          <MenuItem>Registrar notas</MenuItem>
          <MenuItem>Ver reclamos</MenuItem>
        </div>
      </Drawer>
      <Container>
        <div className="header">
          <img src={img1} alt="Avatar" className="avatar" />
          <p>Dr. Hugo Vega Huerta - Docente Principal UNMSM - Fac. Ing. Sistemas e Informática</p>
        </div>
        <div>
          <h2>Reporte de notas</h2>
        </div>
        <table className={classes.dataTable}>
          <thead>
            <tr>
            <th className={classes.tableHeader}>ID</th>
          <th className={classes.tableHeader}>Nombres</th>
          <th className={classes.tableHeader}>Apellidos</th>
          <th className={classes.tableHeader}>Código</th>
          <th className={classes.tableHeader}>Celular</th>
          <th className={classes.tableHeader}>Correo</th>
          <th className={classes.tableHeader}>Evaluación Continua</th>
          <th className={classes.tableHeader}>Evaluación Parcial</th>
          <th className={classes.tableHeader}>Evaluación Final</th>
          <th className={classes.tableHeader}>Promedio</th>
            </tr>
          </thead>
          <tbody>
          {data.map((item, index) => renderRow(item, index, classes.tableCell))}
          </tbody>
        </table>
      </Container>
      <Footer />
    </div>
  );
};

export default RegistrarNotas;

