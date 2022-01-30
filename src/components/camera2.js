import React, { useState, useEffect, useCallback } from 'react';
import { Linking } from 'react-native';
import { RNCamera } from 'react-native-camera';
// TODO: upgrade to Camera, because RNCamera is deprecated
import { Camera } from 'react-native-vision-camera';
import styles from '../App.styles';

const cameraComponent2 = ({onBarCodeRead}) => {
  const [cameraPermission, setCameraPermission] = useState();

    // https://github.com/mrousavy/react-native-vision-camera/blob/main/example/src/PermissionsPage.tsx
    const requestCameraPermission = useCallback(async () => {
      console.log('Requesting camera permission...');
      const permission = await Camera.requestCameraPermission();
      console.log(`Camera permission status: ${permission}`);
  
      if (permission === 'denied') await Linking.openSettings();
      setCameraPermission(permission);
    }, []);
  

  useEffect(() => {
    Camera.getCameraPermissionStatus().then(setCameraPermission);
  }, []);

  console.log(`Re-rendering Navigator. Camera: ${cameraPermission}`);

  if (cameraPermission == null) {
    // loading state
    return null;
  }


  // https://github.com/mrousavy/react-native-vision-camera/blob/main/example/src/App.tsx
  const noPermissions = cameraPermission !== 'authorized';

  if (noPermissions) {
    requestCameraPermission();
  }


  // https://github.com/mrousavy/react-native-vision-camera/blob/main/example/src/CameraPage.tsx
  return (
    <RNCamera
      style={styles.camera}
      captureAudio={false}
      // onGoogleVisionBarcodesDetected={_onBarcodeRecognized}
      onBarCodeRead={onBarCodeRead}
    >
    </RNCamera>
  );
};

export default cameraComponent2;
