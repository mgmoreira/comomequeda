import React, { useEffect, useState } from 'react';
import './Selfie.css'; // Ajusta la ruta según la ubicación de tu archivo CSS
// import { useHistory } from 'react-router-dom';
// import { StepperService } from './stepperService'; // Asegúrate de importar el servicio correcto en tu proyecto
// import { LoadingOverlayServiceService } from './loading-overlay-service-service'; // Asegúrate de importar el servicio correcto en tu proyecto
// import { AuthorizationService } from './authorization-service'; // Asegúrate de importar el servicio correcto en tu proyecto
// import { ValidacionIdentidadService } from './validacion-identidad-service'; // Asegúrate de importar el servicio correcto en tu proyecto
// import { videoInterface } from './video.interface'; // Asegúrate de importar la interfaz correcta en tu proyecto
// import { DataLayerService } from './data-layer.service'; // Asegúrate de importar el servicio correcto en tu proyecto
// import { ModalService } from './modal.service'; // Asegúrate de importar el servicio correcto en tu proyecto
// import { ErrorHandlerService } from './error-handler.service'; // Asegúrate de importar el servicio correcto en tu proyecto
// import { PageNameEnum } from './pagename.enum'; // Asegúrate de importar la enumeración correcta en tu proyecto
import * as faceApiJs from 'face-api.js';
// import { ValidationResult } from './validation-result';
import { isRunningOnMobile, isSafari, validationMobile, validation} from './validation/Validations';
import { Link, useNavigate  } from 'react-router-dom';

// import { CONSTRAINT_DESKTOP, getMobileContrain } from './var.constants';
// import { MensajeError } from './mensaje-error.enum';
// import { AuditoriaService } from './auditoria-service'; // Asegúrate de importar el servicio correcto en tu proyecto
// import { AuditoriaErrorRequest } from './auditoria-error-request';
// import { AuditoriaRequestFactory } from './auditoria-request-factory';

export interface ValidationResult {
  value: boolean;
  msg: string;
}


export const getMobileContrain = () => {
  return CONSTRAINT
}

export const CONSTRAINT = {
audio: false,
video: {
  frameRate:{ exact:30 },
  facingMode: {
    exact: 'user'
  },
  //height: { min: 640, ideal: 1024, max: 1920 },
  //width: { min: 480, ideal: 576, max: 1080 },
  width: { min: 640, ideal: 1280, max: 1920 },
  height: { min: 486, ideal: 720, max: 1080 }
  //width: {min: 1280,ideal: 1920,max: 2560},
  //height: {min: 720,ideal: 1080,max: 1440}
},
};

export const CONSTRAINT_ANDROID = {
audio:false,
video:true
}

export const CONSTRAINT_DESKTOP = {
audio: false,
video: {
  frameRate:{ exact:30 },
  //height: { min: 640, ideal: 1024, max: 1920 },
  //width: { min: 480, ideal: 576, max: 1080 },
  width: { min: 640, ideal: 1280, max: 1920 },
  height: { min: 486, ideal: 720, max: 1080 }
  //width: {min: 1280,ideal: 1920,max: 2560},
  //height: {min: 720,ideal: 1080,max: 1440}
},
};

const SelfieComponent: React.FC = () => {
  const [responseData, setResponseData] = useState(null);
  const history = useNavigate();
  const [mediaRecorder, setMediaRecorder] = useState<any>(null);
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [msg, setMsg] = useState<string>("");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [videoActivo, setVideoActivo] = useState<boolean>(false);
  const [validationCount, setValidationCount] = useState<number>(0);

  useEffect(() => {
    const loadModelsFaceApi = async () => {
      try {
        await Promise.all([
          faceApiJs.nets.tinyFaceDetector.loadFromUri('./assets/models'),
          faceApiJs.nets.faceLandmark68TinyNet.loadFromUri('./assets/models')
        ]);
      } catch (e) {
        throw new Error(`Error al cargar modelos ${e}`);
      }
    };

    loadModelsFaceApi();

    const videoElement = document.getElementById('facevideo') as HTMLVideoElement;
    setVideo(videoElement);

    const setVideoScan = () => {
      let chunks: any[] = [];

      videoElement.setAttribute('autoplay', '');
      videoElement.setAttribute('muted', '');
      videoElement.setAttribute('playsinline', '');

      navigator.mediaDevices.getUserMedia(
        isRunningOnMobile() ? getMobileContrain() : CONSTRAINT_DESKTOP
      ).then((mediaStreamObj) => {
        setStream(mediaStreamObj);
        videoElement.srcObject = mediaStreamObj;

        if (/Android/i.test(navigator.userAgent)) {
          setMediaRecorder(new MediaRecorder(mediaStreamObj, { mimeType: 'video/webm;codecs=vp8' }));
        } else {
          if (isSafari()) {
            setMediaRecorder(new MediaRecorder(mediaStreamObj));
          } else {
            setMediaRecorder(new MediaRecorder(mediaStreamObj, { mimeType: 'video/webm;codecs=vp8' }));
          }
        }

        videoElement.onloadedmetadata = () => {
          setTimeout(() => {
            detect();
          }, 1000);
        };
        videoElement.addEventListener('stop', () => {
          mediaRecorder.stop();
        });
        videoElement.addEventListener('pause', () => {
          if (videoActivo) mediaRecorder.stop();
          mediaStreamObj.getTracks()[0].stop();
          setVideoActivo(false);
        });
        mediaRecorder.ondataavailable = (ev: any) => {
          chunks.push(ev.data);
        };
        mediaRecorder.onstop = () => {
          let blob;

          if (/Android/i.test(navigator.userAgent)) {
            blob = new Blob(chunks, { type: 'video/webm;codecs=vp8' });
          } else {
            if (isSafari()) {
              blob = new Blob(chunks, { type: 'video/mp4' });
            } else {
              blob = new Blob(chunks, { type: 'video/webm;codecs=vp8' });
            }
          }

          chunks = [];

          // Deja de mostrar video que grababa
          mediaStreamObj.getTracks()[0].stop();
          setVideoActivo(false);

          terminarGrabacion(blob);
        };
      }).catch(error => {
        // if (error.name == "NotAllowedError" || error.name == "PermissionDeniedError")
          // modalService.openModalError(MensajeError.PERMISOS_CAMARA);
          // alert("2")
        // else
          // alert("1")
          // modalService.openModalError(MensajeError.ACCESIBILDAD_CAMARA);
      });
    };

    const detect = () => {
      const canvas = faceApiJs.createCanvasFromMedia(videoElement) as HTMLCanvasElement;
      faceApiJs.matchDimensions(canvas, videoElement, true);

      canvas.id = "canvas";
      canvas.style.position = 'absolute';
      canvas.style.backgroundColor = 'red';
      canvas.style.opacity = '70%';
      canvas.style.background = 'transparent';
      let grabando = false;
      setVideoActivo(false);

      const interval = setInterval(async () => {
        if (!grabando) {
          const scan = await faceApiJs.detectSingleFace(videoElement, new faceApiJs.TinyFaceDetectorOptions()).withFaceLandmarks(true);
          // (video as HTMLVideoElement).style.filter = "blur(0px)";
          videoElement.style.borderColor = 'green';

          const result = scan?.detection;
          let pos = { x: 0, y: 0, w: 0, h: 0 };
          scan?.landmarks.getLeftEye().forEach(point => {
            pos = { x: point.x, y: point.y, w: 0, h: 0 };
            return;
          });
          scan?.landmarks.getRightEye().forEach(point => {
            pos = {
              ...pos,
              w: point.x - pos.x,
              h: point.y - pos.y
            };
          });

          if (result != null) {
            if (result != undefined) {
              const { x, y, w, h } = pos;
              var isValid;
              var validationResult: ValidationResult = { value: false, msg: "" };

              // Para mobile se utiliza un calculo distinto para la validación
              if (isRunningOnMobile()) {          
                validationResult = validationMobile(canvas, x, y, w);
              } else {
                validationResult = validation(canvas, x, y, w);
              }

              if (!validationResult.value && !grabando) {
                setMsg(validationResult.msg);
              }

              isValid = validationResult.value;

              if (isValid && !grabando) {
                grabando = true;
                setVideoActivo(true);
                clearInterval(interval);
                takePhoto();              }
            }
          }
        }
        else
          clearInterval(interval);
      }, 1000);
    };

    const takePhoto = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        const dataURL = canvas.toDataURL('image/jpeg');

        handleImage(dataURL);
      }
    };

    const handleImage = (imageData: string) => {
      console.log(imageData)

      // // Hacer la solicitud a la API
      // fetch('https://api.ejemplo.com/data')
      //   .then(response => response.json())
      //   .then(data => {
      //     // Guardar la respuesta de la API en el estado
      //     // setResponseData(data);
  
      //     // Redireccionar a la página de contacto
          // history('/hair');
          history('/hair', {
            state: {
              selfie: imageData,
            }
          });
      //   })
      //   .catch(error => console.error('Error:', error));
    };
  


    const terminarGrabacion = (data: Blob) => {
      // alert("stop")
      var reader = new FileReader();
      reader.readAsDataURL(data);
      // reader.onloadend = () => {
      //   let salida: videoInterface = {
      //     video: reader.result.toString()
      //   }
      //   handleImage(salida);
      // }
    };

    // const navegarPaginaErrorProducto = () => {
    //   history.push('../error/producto');
    // };

    // const navegarPaginaError = () => {
    //   auth.authorize();
    //   history.push('../rostro-error');
    // };

    // const navegarInicio = (message: string) => {
    //   modalService.openModalError(message);
    //   stepperService.resetStepper();
    //   history.push('../intro');
    // };

    setVideoScan();
  }, []); // Pasa un arreglo vacío para que este efecto se ejecute solo una vez al montar el componente

  return (
    <div className="App">
      <video id="facevideo" style={{ backgroundColor: '#626060', zIndex: 50, filter: 'blur(0px)' }} autoPlay muted playsInline></video>
      <img id="ovalImg" src="./assets/ovalo.svg" className="Exclusin-1" style={{ position: 'absolute', zIndex: 100 }} />
      <p className="msg top" style={{ position: 'absolute', zIndex: 200 }}>{msg}</p>
      <div id="loader" className="loader3" style={{ display: 'none', position: 'absolute', zIndex: 800 }}></div>
    </div>
  );
};

export default SelfieComponent;
