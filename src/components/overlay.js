import React from 'react';
import styles from '../App.styles';
import PassKit, { AddPassButton } from 'react-native-passkit-wallet'

const Overlay = ({onRequest}) => {
  return (
    <AddPassButton
      style={styles.button}
      addPassButtonStyle={PassKit.AddPassButtonStyle.black}
      onPress={onRequest}
    />
  );
};

export default Overlay;
