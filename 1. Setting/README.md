# 장치 설정하기

<img src="https://user-images.githubusercontent.com/50460114/182013809-1ecb5516-03a4-48aa-afeb-91271d55576e.png" width="640px"/>
## 실행방법
1. 위 저장소를 클론 받는다.
2. `1. Setting` 폴더의 `index.html`에서 `Live Server`를 실행시킨다.

[Live Server 다운로드](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

## 기능
1. 최초 권한 허용 시, 자동으로 장치 리스트 불러오고 영상 받아옴
2. 장치가 추가되거나 제거될 시 자동으로 장치 리스트 갱신 및 영상 받아옴
3. 카메라 및 마이크 ON/OFF
## 코드 및 설명
###🫧 장치 추가/제거 인식
`ondevicechange`를 통해 장치리스트의 변경을 감지해준다. 장치리스트의 변경이란, 예를 들어 웹캠을 하나 더 꽂았거나, 연결되어있는 카메라를 뽑았거나 등의 상태를 말한다.
```javascript
navigator.mediaDevices.ondevicechange = (event) => {
    updateList();
    startStreaming();
}
```

###🫧 장치 권한 변경 감지
`navigator.permissions.query`를 통해 해당 장치의 권한 정보를 받아올 수 있다.(사파리에서는 아직 실험단계) 내부에서 `onchange`이벤트를 등록할 경우, 장치 권한이 변경되었을 때 해당 이벤트가 실행된다. 장치 권한이란, 브라우저에서 해당 장치를 써도 되나요? 물어봤을 때 `허용/차단` 누르는 바로 그걸! 말한다.
```javascript
navigator.permissions.query({name: "camera"}, {name: "microphone"}).then((permissionStatus) => {
    permissionStatus.onchange = () => {
        updateList();
        startStreaming();
    };
});
```

###🫧 장치를 사용하지 못하는 예외사항 잡기
- DevicesNotFoundError
- PermissionDeniedError
- NotReadableError
```javascript
const checkPermissions = () => {
    try {
        const stream = navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        stopStream(stream);
    } catch(error) {
        /* 여기서 잡으면 됨 */
    }
}
```

###🫧 카메라 ON/OFF
`getVideoTracks()`를 이용해 비디오 트랙 리스트(배열)를 가져온 다음, 해당 리스트를 돌면서 각각의 `enabled` 속성에 `true/false` 값을 할당해주면 된다.
```javascript
const handleCameraVisible = (show) => {
    const tracks = localStream.getVideoTracks();
    tracks.forEach((track) => {
        track.enabled = show;
    })
    video.srcObject = localStream;
}
```

###🫧 마이크 ON/OFF
`getAudioTracks()`를 이용해 오디오 트랙 리스트(배열)를 가져온 다음, 해당 리스트를 돌면서 각각의 `enabled` 속성에 `true/false` 값을 할당해주면 된다.
```javascript
const handleMicUse = (use) => {
    const tracks = localStream.getAudioTracks();
    tracks.forEach((track) => {
        track.enabled = use;
    })
    video.srcObject = localStream;
}
```