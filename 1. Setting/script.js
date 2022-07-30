(() => {
    const video = document.querySelector("#localVideo");
    const cameraList = document.querySelector("#cameraList");
    const audioList = document.querySelector("#audioList");
    const speakerList = document.querySelector("#speakerList");
    const cameraButton = document.querySelector(".camera");
    const selectedDevices = {
        camera: "",
        audio: "",
        speaker: ""
    };
    let localStream = null;

    const initialSetting = () => {
        registerChangeEvent();
        registerDeviceUpdateEvent();
        registerPermissionChangeEvent();
        registerClickEvent();
        checkPermissions();
        updateList();
        startStreaming();
    }

    const registerClickEvent = () => {
        const handleOnOff = (e) => {
            const { target } = e;
            if (target.classList.contains("on")) {
                target.classList.remove("on");
                target.classList.add("off");
                target.innerText = "Camera OFF";
                handleCameraVisible(false);
            } else {
                target.classList.remove("off");
                target.classList.add("on");
                target.innerText = "Camera ON";
                handleCameraVisible(true);
            }
        }

        cameraButton.addEventListener("click", handleOnOff);
    }

    const registerChangeEvent = () => {
        cameraList.addEventListener("change", () => {
            saveDevices("camera", cameraList.value);
            startStreaming();
        })
        audioList.addEventListener("change", () => {
            saveDevices("audio", audioList.value);
            startStreaming();
        })
        speakerList.addEventListener("change", () => {
            saveDevices("speaker", speakerList.value);
            startStreaming();
        })
    }

    const registerDeviceUpdateEvent = () => {
        navigator.mediaDevices.ondevicechange = (event) => {
            updateList();
            startStreaming();
        }
    }

    const registerPermissionChangeEvent = () => {
        navigator.permissions.query({name: "camera"}, {name: "microphone"}).then((permissionStatus) => {
            permissionStatus.onchange = () => {
                updateList();
                startStreaming();
        };
});
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
        
        viewList(cameraList, cameras, "camera");
        viewList(audioList, audios, "audio");
        viewList(speakerList, speakers, "speaker");
    }

    const viewList = (element, list, name) => {
        const listElement = list.map((device) => `<option value=${device.deviceId}>${device.label}</option>`).join('');
        element.innerHTML = listElement;
        
        if (selectedDevices[name]) {
            element.value = selectedDevices[name];
        } else {
            saveDevices(name, list[0].deviceId);
        }
    }

    const saveDevices = (name, value) => {
        selectedDevices[name] = value;
    }

    const startStreaming = async () => {
        if (!selectedDevices) return;
        if (localStream) {
            stopStream(localStream);
        }

        const constraints = {
            video: {
                deviceId: selectedDevices["camera"],
                width: 1280,
                height: 720
            },
            audio: {
                deviceId: selectedDevices["audio"],
            }
        }
        localStream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = localStream;
    }

    const handleCameraVisible = (show) => {
        const tracks = localStream.getVideoTracks();
        tracks.forEach((track) => {
            track.enabled = show;
        })
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