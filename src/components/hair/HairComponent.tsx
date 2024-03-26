import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AppBar, Toolbar, Container } from "@mui/material";
import { styled } from '@mui/material/styles';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Grid from '@mui/material/Grid';
import { useGoogleLogin, TokenResponse, googleLogout } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';
import LoadingSpinner from "../Loading/LoadingSpinner";

export const HairComponent: React.FC = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [selfie, setSelfie] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const estiloTemplate = {
    width: '100%'
  };

  const estiloImagen = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1,
  } as React.CSSProperties;;

  const StyledFab = styled(Fab)({
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
  });

  const location = useLocation();
  const history = useNavigate();

  const setSelfiesInit = () => {

    let selfie = location.state.selfie;
    setSelfie(selfie);
    
  };

  const toggleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setMenuAbierto(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuAbierto(false);
  };

  const responseMessage = (response: any) => {
    console.log(response);
    localStorage.setItem('authToken', response.credential);
  };

  const errorMessage = (error: any) => {
    console.log(error);
  };

  const logOut = () => {
    googleLogout();
    localStorage.removeItem('userToken');
  };

  const [user, setUser] = useState<any>(null);
  const [tokenResponse, setTokenResponse] = useState<TokenResponse | null>();
  const [toggle, setToggle] = useState<any>(false);
  const [isLoading, setIsLoading] = useState<any>(false);


  useEffect(
    () => {
      setSelfiesInit();
    }, []
  );

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      localStorage.setItem('authToken', tokenResponse.access_token);


      fetch(`https://bcba.certant.com/apiface/login?access_token=${tokenResponse.access_token}`)
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem('userToken', data.jwt_token)
        handleImage()
      })
      .catch((error) => console.error(error));
      //Reemplazar por nuevo pedido a nuestro back para obtener token
      //Reemplazar por nuevo pedido a nuestro back para obtener token

    },
    onError: errorResponse => console.log(errorResponse),
  });

  // const getInfoUser = async () => {
  //   const authToken = localStorage.getItem('authToken');
  //   if (authToken != null) {
  //     const userInfo = await axios
  //       .get('https://www.googleapis.com/oauth2/v3/userinfo', {
  //         headers: { Authorization: `Bearer ${authToken}` },
  //       })
  //       .then(res => {
  //         if (res.status == 200)
  //           setUser(res.data);
          
  //       }).catch(e => {
  //         console.log(e);
  //       });;
  //   }
  // };

  const toggleAppBar = () => {
    setToggle(!toggle);
  };

  const templateClick = () => {
    const userToken = localStorage.getItem('userToken');
    if (!userToken){
      googleLogin()
    }else {
      handleImage()
    }
  }

  const handleImage = () => {
    setIsLoading(true)
    // axios
    // .post("https://bcba.certant.com/apiface/generar", {
    //   title: "Hello World!",
    //   body: "This is a new post."
    // })
    // .then((response) => {
    //   console.log(response)
    // });


    // Simple POST request with a JSON body using fetch
    //   const requestOptions = {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ title: 'React POST Request Example' }),
    //       // mode: 'no-cors'
    //   };
    //   fetch('https://bcba.certant.com/apiface/generar', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ title: 'React POST Request Example' }),
    //     mode: 'no-cors'
    // })
    //       .then(response => response.json())
    //       .then(data => console.log(data));


    // // Hacer la solicitud a la API
    fetch('https://bcba.certant.com/apiface/generar', {
            // mode: 'no-cors',
            method: 'post',
            headers: { 'Content-Type': 'application/json',
                      'Authorization': 'Bearer '+ localStorage.getItem('userToken')},
            body: JSON.stringify({
              "image": selfie
            })
          })
      .then(response => response.json())
      .then(data => {
        // Guardar la respuesta de la API en el estado
        // setResponseData(data);
        setSelfie(data)
        setIsLoading(false)

        // Redireccionar a la página de contacto          
      })
      .catch(error => {
        console.error('Error:', error)
        setIsLoading(false)
      });
  };

  return (
    <Container style={true ? {width:'100%'} : {}}>
    <div>
      <img src={selfie} alt="Imagen selfie" style={estiloImagen} />
      <AppBar position="fixed" color="primary" sx={{ transition: 'all .1s ease-in-out', top: 'auto', bottom: 0, boxShadow: 'none', backgroundColor: '#fff0', height: !toggle ? '20%' : '60%' }}>
        <Toolbar sx={{ margin: '20px', backgroundColor: '#ffffff2b', height: toggle ? '100%' : '100%' }}>
          {/* <IconButton color="inherit" aria-label="open drawer"> */}
          {/* <MenuIcon /> */}
          {/* </IconButton> */}
          {!toggle ? (
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <img src="./template.png" style={estiloTemplate} onClick={templateClick}/>
              </Grid>
              <Grid item xs={3}>
                <img src="./template.png" style={estiloTemplate} />
              </Grid>
              <Grid item xs={3}>
                <img src="./template.png" style={estiloTemplate} />
              </Grid>
              <Grid item xs={3}>
                <img src="./template.png" style={estiloTemplate} />
              </Grid>
            </Grid>
          ) :
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <img src="./template.png" style={estiloTemplate} />
              </Grid>
              <Grid item xs={4}>
                <img src="./template.png" style={estiloTemplate} />
              </Grid>
              <Grid item xs={4}>
                <img src="./template.png" style={estiloTemplate} />
              </Grid>
              <Grid item xs={4}>
                <img src="./template.png" style={estiloTemplate} />
              </Grid>
              <Grid item xs={4}>
                <img src="./template.png" style={estiloTemplate} />
              </Grid>
              <Grid item xs={4}>
                <img src="./template.png" style={estiloTemplate} />
              </Grid>
              <Grid item xs={4}>
                <img src="./template.png" style={estiloTemplate} />
              </Grid>
              <Grid item xs={4}>
                <img src="./template.png" style={estiloTemplate} />
              </Grid>
            </Grid>}


          <StyledFab color="secondary" aria-label="add">
            {!toggle ? <AddIcon onClick={toggleAppBar} color='warning'/> : <RemoveIcon onClick={toggleAppBar} color='warning'/>}
          </StyledFab>
          {/* <Box sx={{ flexGrow: 1 }} /> */}
          {/* <IconButton color="inherit" size="large" className="MuiIconButton-sizeLarge"> */}
          {/* <SearchIcon /> */}
          {/* </IconButton> */}
          {/* <IconButton color="inherit"> */}
          {/* <MoreIcon /> */}
          {/* </IconButton> */}
          {user && (<div>{user.name}</div>)}
          <button onClick={() => googleLogin()}>
          {/* Login */}
          </button>
          <button onClick={logOut}>Log out</button>
        </Toolbar>
      </AppBar>
    </div>
    <div >
      {isLoading && (
        <div >
          <LoadingSpinner />
        </div>
      )}
    </div>
    </Container>
  );
};
