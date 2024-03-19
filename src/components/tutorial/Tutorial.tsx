import React from 'react';
import { Container, Grid, Button } from '@mui/material';
import './Tutorial.css'; // Ajusta la ruta según la ubicación de tu archivo CSS
import { useNavigate } from 'react-router-dom';

const TutorialComponent = () => {
  const isLandscape = false; // Define tu lógica para determinar si es apaisado o no
  const history = useNavigate();

  return (
    <Container className="img-container contenido margin-negative-top">
      <Grid container justifyContent="center" alignItems="center">
        {!isLandscape && (
          <Grid item xs={12} className="text-center">
            <span id="texto-registro"><b>Ahora preparate<br />para una foto</b></span>
          </Grid>
        )}
        <Grid item xs={12} sm={6} className="pl-0 pr-0 text-center contenedorImagen">
          <img src='./assets/tutorial_selfie_pink.png' alt="Banco Ciudad" id="fotoVerificado" />
        </Grid>
        <Grid item xs={12} sm={6} className="text-center" id="p-pasos">
          {isLandscape && (
            <pre id="texto-registro"><b>Ahora prepárate<br />para una foto</b><br /></pre>
          )}
          <pre className="pasos texto-tutorial mb-2">Buscá un lugar con buena luz.</pre>
          <pre className="pasos texto-tutorial mb-0">
            Es importante que tu rostro y cabello<br />estén despejados, sin accesorios,<br />y que te encuentres frente a la cámara.
          </pre><br />
          <Button variant="contained" color="primary" id="btn-continuar" onClick={() => history('/selfie')}>
            Continuar
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TutorialComponent;