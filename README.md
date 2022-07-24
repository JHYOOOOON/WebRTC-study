# WebRTC-study
[WebRTC 문서](https://webrtc.org/getting-started/media-devices)

### 미디어 기기 시작하기
- `navigator.mediaDevices` 객체를 통해 액세스
- `getUserMedia()` 호출은 각 장치(카메라, 마이크)에 대한 권한 요청을 트리거

```javascript
const openMediaDevices = async (constraints) => {
    return await navigator.mediaDevices.getUserMedia(constraints);
}

try {
    const stream = openMediaDevices({'video':true,'audio':true});
    console.log('Got MediaStream:', stream);
} catch(error) {
    console.error('Error accessing media devices.', error);
}
```
- `getUserMedia()`의 에러
    - DevicesNotFoundError
        기기가 연결되어 있지 않을 시
    - PermissionDeniedError
        권한 거부 시(브라우저에서 거부, 시스템 자체에서 거부)
    - NotReadableError
        장치를 읽을 수 없을 시

### 미디어 기기 쿼리
- 모든 카메라와 마이크를 확인 `enumerateDevices()` 함수 호출
- `kind`에 `audioinput`, `auidooutput`, `videoinput` 속성으로 구분
```javascript
async function getConnectedDevices(type) {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === type)
}

const videoCameras = getConnectedDevices('videoinput');
console.log('Cameras found:', videoCameras);
```

### 기기 변경사항 수신 대기
[mdn 참고](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/devicechange_event)
`devicechange` 이벤트로 감지
```javascript
// addEventListener 이용
navigator.mediaDevices.addEventListener('devicechange', event => {
    const newCameraList = getConnectedDevices('video');
    updateCameraList(newCameraList);
});
```

```javascript
// event handler property
navigator.mediaDevices.ondevicechange = (event) => {
  updateDeviceList();
}
```

### 미디어 제약 조건
- `getUserMedia()`에 매개변수를 전달해 특정 요구사항과 일치하는 미디어 기기를 열 수 있음
- 오디오 / 동영상 또는 최소 카메라 해상도, 정확한 기기 ID까지 전달 가능
```javascript
async function openCamera(cameraId, minWidth, minHeight) {
    const constraints = {
        'audio': {'echoCancellation': true},
        'video': {
            'deviceId': cameraId,
            'width': {'min': minWidth},
            'height': {'min': minHeight}
            }
        }

    return await navigator.mediaDevices.getUserMedia(constraints);
}
```

### 로컬 재생
- `autoplay` 새 스트림이 자동으로 재생
- `playsinline` 특정 모바일 브라우저에서 동영상을 전체 화면이 아닌 인라인으로 재생할 수 있음
- `controls="false"` 사용자가 영상을 일시중지할 수 있다면 사용 권장
```javascript
async function playVideoFromCamera() {
    try {
        const constraints = {'video': true, 'audio': true};
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const videoElement = document.querySelector('video#localVideo');
        videoElement.srcObject = stream;
    } catch(error) {
        console.error('Error opening video camera.', error);
    }
}
```
```html
<html>
<head><title>Local video playback</video></head>
<body>
    <video id="localVideo" autoplay playsinline controls="false"/>
</body>
</html>
```

### 제약 조건
- 근거리
    ```javascript
    {
        "video": {
            "width": 640,
            "height": 480
        }
    }
    ```
- 범위 지정
    ```javascript
    {
        "video": {
            "width": {
                "min": 640,
                "max": 1024
            },
            "height": {
                "min": 480,
                "max": 768
            }
        }
    }
    ```
- `exact` 이 제약조건과 정확히 일치하는 미디어 스트림만 반환
    ```javascript
    {
        "video": {
            "width": {
                "exact": 1024
            },
            "height": {
                "exact": 768
            }
        }
    }
    ```
- `MediaStreamTrack.getSettings()` 특정 트랙의 실제 구성 확인
- `applyConstraints()` 연 미디어 기기에서 트랙의 제약 조건 업데이트 가능
    -> 기존 스트림을 닫지 않고도 미디어 기기를 다시 구성할 수 있음

### 스트림 및 트랙
- `MediaStream`
    - 오디오 및 동영상의 트랙으로 구성된 미디어 콘텐츠의 스트림
    - `MediaStream.getTracks()`를 호출해 `MediaStream`에서 모든 트랙을 검색할 수 있음
    - `enabled` 속성을 전환해 각 트랙을 음소거할 수 있음