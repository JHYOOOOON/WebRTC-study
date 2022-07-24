(() => {
    const video = document.querySelector("#localVideo");
    const cameraList = document.querySelector("#cameraList");
    const audioList = document.querySelector("#audioList");
    const speakerList = document.querySelector("#speakerList");
    let localStream = null;

    const initialSetting = () => {
        checkPermissions();
        updateList();
        startStreaming();
    }
    
    const checkPermissions = () => {
        try {
            const stream = navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            stopStream(stream);
        } catch(error) {
        }
    }

    const updateList = async () => {
        const mediaList = await navigator.mediaDevices.enumerateDevices();
        const cameras = mediaList.filter((media) => media.kind === "videoinput");
        const audios = mediaList.filter((media) => media.kind === "audioinput");
        const speakers = mediaList.filter((media) => media.kind === "audioinput");
        
        viewList(cameraList, cameras);
        viewList(audioList, audios);
        viewList(speakerList, speakers);
    }

    const viewList = (element, list) => {
        const listElement = list.map((device) => `<option id=${device.deviceId}>${device.label}</option>`).join('');
        element.innerHTML = listElement;
    }

    const startStreaming = async () => {
        const constraints = {
            video: {
                deviceId: cameraList.value,
                width: 1280,
                height: 720
            },
            audio: {
                deviceId: audioList.value,
            }
        }
        localStream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = localStream;
    }

    const stopStream = (stream) => {
        const tracks = stream.getTracks();

        tracks.forEach(function(track) {
            track.stop();
        });
    }

    initialSetting();
})();