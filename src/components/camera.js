import React, { useState, useEffect, useCallback } from 'react';
import { Linking } from 'react-native';
import { RNCamera } from 'react-native-camera';
// TODO: upgrade to Camera, because RNCamera is deprecated
import styles from '../App.styles';

const cameraComponent = ({onBarCodeRead}) => {
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

export default cameraComponent;
