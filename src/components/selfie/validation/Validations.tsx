
const HELP_MESSAGES = {
  DONT_MOVE: "Permanezca quieto un momento",
  MOVE_UP: "Mueva la camara hacia arriba",
  MOVE_DOWN: "Mueva la camara hacia abajo",
  MOVE_LEFT: "Mueva la camara hacia la izquierda",
  MOVE_RIGHT: "Mueva la camara hacia la derecha",
  MOVE_AWAY: "Por favor, aléjese un poco",
  MOVE_CLOSER: "Por favor, acérquese un poco",
}

export interface ValidationResult {
  value: boolean;
  msg: string;
}

export const validationMobile = (canvas: HTMLCanvasElement, x: number, y: number, w: number): ValidationResult => {
  if(!isPortrait()){
    return validationLandscape(720,1280,x,y,w)
  }
  if(/Android/i.test(navigator.userAgent)){
    return validationAndroid(canvas,x,y,w)
  }
  return validationIOS(canvas,x,y,w)
}

export const secondValidationMobile = (canvas: HTMLCanvasElement, x: number, y: number, w: number): ValidationResult => {
  if(!isPortrait()){
    return validationLandscape(720,1280,x,y,w)
  }
  return secondValidation(canvas,x,y,w)
}

const validationIOS = (canvas: HTMLCanvasElement, x: number, y: number, w: number): ValidationResult => {
  let result: ValidationResult = { value: false, msg: "Centre su rostro en el ovalo" }

  //Caso exitoso
  if (
    y > canvas.height * 0.4 && y <= canvas.height * 0.5 &&
    x > canvas.width * 0.35 && x <= canvas.width * 0.4 &&
    w <= 175 && w >= 150
  ) {
    return result = { value: true, msg: HELP_MESSAGES.DONT_MOVE }
  }


  //Mas lejos
  if (w > 175) {
    return result = { value: false, msg: HELP_MESSAGES.MOVE_AWAY }
  }

  //Mas cerca
  if (w < 150) {
    return result = { value: false, msg: HELP_MESSAGES.MOVE_CLOSER }
  }

  //Mas abajo
  if (
    y < canvas.height * 0.4 &&
    x > canvas.width * 0.35 && x <= canvas.width * 0.4
  ) {
    return result = { value: false, msg: HELP_MESSAGES.MOVE_UP }
  }

  //Mas arriba
  if (
    y > canvas.height * 0.5 &&
    x >= canvas.width * 0.35 && x <= canvas.width * 0.4
  ) {
    return result = { value: false, msg: HELP_MESSAGES.MOVE_DOWN }
  }

  //Mas a la derecha
  if (
    y > canvas.height * 0.4 && y <= canvas.height * 0.5 &&
    x < canvas.width * 0.35
  ) {
    return result = { value: false, msg: HELP_MESSAGES.MOVE_RIGHT }
  }

  //Mas a la izquierda
  if (
    y > canvas.height * 0.4 && y <= canvas.height * 0.5 &&
    x > canvas.width * 0.4
  ) {
    return result = { value: false, msg: HELP_MESSAGES.MOVE_LEFT }
  }

  return result
}

export const secondValidation = (canvas: HTMLCanvasElement, x: number, y: number, w: number): ValidationResult => {

  let result: ValidationResult = { value: false, msg: "Centre su rostro en el ovalo" }

  //Caso exitoso
  if (
    y >= canvas.height * 0.3 && y <= canvas.height * 0.5 &&
    x >= canvas.width * 0.3 && x <= canvas.width * 0.55
    && w <= 180 && w >= 120
  ) {
    return result = { value: true, msg: HELP_MESSAGES.DONT_MOVE }
  }


  //Mas lejos
  if (w > 180) {
    return result = { value: false, msg: HELP_MESSAGES.MOVE_AWAY }
  }

  //Mas cerca
  if (w < 120) {
    return result = { value: false, msg: HELP_MESSAGES.MOVE_CLOSER }
  }

  //Mas abajo
  if (
    y <= canvas.height * 0.3
  ) {
    return result = { value: false, msg: HELP_MESSAGES.MOVE_UP }
  }

  //Mas arriba
  if (
    y >= canvas.height * 0.5
  ) {
    return result = { value: false, msg: HELP_MESSAGES.MOVE_DOWN }
  }

  //Mas a la derecha
  if (
    x <= canvas.width * 0.3
  ) {
    return result = { value: false, msg: HELP_MESSAGES.MOVE_RIGHT }
  }

  //Mas a la izquierda
  if (
    x >= canvas.width * 0.55
  ) {
    return result = { value: false, msg: HELP_MESSAGES.MOVE_LEFT }
  }

  return result
}

export const validationAndroid = (canvas: HTMLCanvasElement, x: number, y: number, w: number): ValidationResult => {

  let result: ValidationResult = { value: false, msg: "Centre su rostro en el ovalo" }

  //Caso exitoso
  if (
    y >= canvas.height * 0.35 && y <= canvas.height * 0.48 &&
    x >= canvas.width * 0.34 && x <= canvas.width * 0.5 
    && w <= 160 && w >= 130
  ) {
    return result = { value: true, msg: HELP_MESSAGES.DONT_MOVE }
  }


  //Mas lejos
  if (w > 160) {
    return result = { value: false, msg: HELP_MESSAGES.MOVE_AWAY }
  }

  //Mas cerca
  if (w < 130) {
    return result = { value: false, msg: HELP_MESSAGES.MOVE_CLOSER }
  }

  //Mas abajo
  if (
    y <= canvas.height * 0.35 
  ) {
    return result = { value: false, msg: HELP_MESSAGES.MOVE_UP }
  }

  //Mas arriba
  if (
    y >= canvas.height * 0.48
  ) {
    return result = { value: false, msg: HELP_MESSAGES.MOVE_DOWN }
  }

  //Mas a la derecha
  if (
    x <= canvas.width * 0.34
  ) {
    return result = { value: false, msg: HELP_MESSAGES.MOVE_RIGHT }
  }

  //Mas a la izquierda
  if (
    x >= canvas.width * 0.5
  ) {
    return result = { value: false, msg: HELP_MESSAGES.MOVE_LEFT }
  }

  return result
}

export const validation = (canvas: HTMLCanvasElement, x: number, y: number, w: number): ValidationResult => {
  let result: ValidationResult = { value: false, msg: "Centre su rostro en el ovalo" }

  //Caso existoso
  if (
    y >= canvas.height * 0.42 && y <= canvas.height * 0.45 &&
    x >= canvas.width * 0.44 && x <= canvas.width * 0.47 &&
    w >= 80 && w <= 120
  ) {
    return result = { value: true, msg: HELP_MESSAGES.DONT_MOVE }
  }

  //Mas lejos
  if (w > 120) {
    return result = { value: false, msg: HELP_MESSAGES.MOVE_AWAY }
  }

  //Mas cerca
  if (w < 80) {
    return result = { value: false, msg: HELP_MESSAGES.MOVE_CLOSER }
  }

  //Mas abajo
  if (
    y < canvas.height * 0.42
  ) {
    return result = { value: false, msg: HELP_MESSAGES.MOVE_UP }
  }

  //Mas arriba
  if (
    y > canvas.height * 0.45
  ) {
    return result = { value: false, msg: HELP_MESSAGES.MOVE_DOWN }
  }

  //Mas a la derecha
  if (
    x < canvas.width * 0.44
  ) {
    return result = { value: false, msg: HELP_MESSAGES.MOVE_RIGHT }
  }

  //Mas a la izquierda
  if (
    x > canvas.width * 0.47
  ) {
    return result = { value: false, msg: HELP_MESSAGES.MOVE_LEFT }
  }

  return result
}

export const validationLandscape = (canvasHeight:number,canvasWidth:number, x: number, y: number, w: number): ValidationResult => {
  let result: ValidationResult = { value: false, msg: "Centre su rostro en el ovalo" }


  //Caso existoso
  if (
    y >= canvasHeight * 0.35 && y <= canvasHeight * 0.45 &&
    x >= canvasWidth * 0.4 && x <= canvasWidth * 0.45 &&
    w >= 90 && w <= 120
  ) {
    return result = { value: true, msg: HELP_MESSAGES.DONT_MOVE }
  }

  //Mas lejos
  if (w > 120) {
    return result = { value: false, msg: HELP_MESSAGES.MOVE_AWAY }
  }


  //Mas cerca
  if (w < 90) {
    return result = { value: false, msg: HELP_MESSAGES.MOVE_CLOSER }
  }

  //Mas abajo
  if (
    y < canvasHeight * 0.35
  ) {
    return result = { value: false, msg: HELP_MESSAGES.MOVE_UP }
  }

  //Mas arriba
  if (
    y > canvasHeight * 0.45
  ) {
    return result = { value: false, msg: HELP_MESSAGES.MOVE_DOWN }
  }

  //Mas a la derecha
  if (
    x < canvasWidth * 0.4
  ) {
    return result = { value: false, msg: HELP_MESSAGES.MOVE_RIGHT }
  }

  //Mas a la izquierda
  if (
    x > canvasWidth * 0.45
  ) {
    return result = { value: false, msg: HELP_MESSAGES.MOVE_LEFT }
  }

  return result
}

export const isRunningOnMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export const isSafari = () => {
  const is_safari = navigator.userAgent.toLowerCase().indexOf('safari/') > -1;
  return is_safari;
}

export const isIOS = () => {
   return (/iPad|iPhone|iPod/.test(navigator.userAgent))
}

export const isPortrait = () => {
  return window.innerHeight > window.innerWidth;
}
