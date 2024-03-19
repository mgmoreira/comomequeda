// import { download } from "src/app/utils/Utils";


declare const MediaRecorder: any;

export enum RecordingStates {
    RECORDING,
    INACTIVE,
    COMPLETE
}

export const isIOS = () => {
    return (/iPad|iPhone|iPod/.test(navigator.userAgent))
 }

export const isSafari = () => {
    const is_safari = navigator.userAgent.toLowerCase().indexOf('safari/') > -1;
    return is_safari;
  }

class MyVideoRecorder {

    private mediaRecorder: typeof MediaRecorder;
    private video: HTMLVideoElement
    private stream: MediaStream
    private chunks: Blob[] = []
    private state: RecordingStates = RecordingStates.INACTIVE;
    private rejectVideo: any;
    private videoCount = 0

    private finalChunks: Blob[] = []

    public getState() {
        return this.state;
    }

    public isRecording() {
        return this.state === RecordingStates.RECORDING;
    }

    public isComplete() {
        return this.state === RecordingStates.COMPLETE;
    }

    public isInactive() {
        return this.state === RecordingStates.INACTIVE;
    }

    constructor(video: HTMLVideoElement, stream:MediaStream) {
        this.video = video;
        this.stream = stream
    }

    record():Promise<Blob> {
        this.setupMediaRecorder()
        this.chunks = []
        this.videoCount = 0

        return new Promise((res, rej) => {

            this.mediaRecorder.start(1000)
            this.state = RecordingStates.RECORDING;
            this.rejectVideo = rej
            while (this.mediaRecorder.state !== "recording") {
                //do nothing 
            }
            this.mediaRecorder.onstop = () => {
                res(this.finish())
            }
        })

    }

    private setupMediaRecorder() {
        if (/Android/i.test(navigator.userAgent)) {
            this.mediaRecorder = new MediaRecorder(this.stream, { mimeType: 'video/webm;codecs=vp8' });
        } else {
            if (isSafari()) {
                this.mediaRecorder = new MediaRecorder(this.stream);
            } else {
                this.mediaRecorder = new MediaRecorder(this.stream, { mimeType: 'video/webm;codecs=vp8' });
            }
        }

        this.mediaRecorder.ondataavailable = (ev: any) => {
            if (this.isComplete()) {
                return;
            }
            this.videoCount++
            this.chunks.push(ev.data)
            let totalDuration = 3
            if(isIOS()){
                totalDuration = 1
            }
            if (this.videoCount > totalDuration) {
                if (!this.isComplete()) {
                    this.state = RecordingStates.COMPLETE
                    this.finalChunks = [...this.chunks]
                    this.mediaRecorder.stop()
                }
            }
        };
    }

    private finish() {
        return this.generateBlob()
    }

    public restart() {
        this.rejectVideo()
        this.state = RecordingStates.INACTIVE;
        if (this.mediaRecorder.state == "recording") {
            this.mediaRecorder.onstop = () => { }
            this.mediaRecorder.stop();
        }
    }

    private generateBlob(){
        let blob;
        if (/Android/i.test(navigator.userAgent)) {
            blob = new Blob(this.finalChunks, { type: 'video/webm;codecs=vp8' });
        } else {
            if (isSafari()) {
                blob = new Blob(this.finalChunks, { type: 'video/mp4' });
            } else {
                blob = new Blob(this.finalChunks, { type: 'video/webm;codecs=vp8' });
            }
        }

        this.chunks = []
        this.finalChunks = []

        return blob;
    }

    private async generateBase64Data(blob:Blob) {
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.addEventListener('load', () => {
            var base64data = reader.result as string;
            // download("videobase64.txt", base64data)
            return base64data
        })
    }


}

export default MyVideoRecorder;