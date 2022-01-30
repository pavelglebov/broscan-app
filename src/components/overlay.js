import React from 'react';
import {
  Text,
  Pressable,
} from 'react-native';
import styles from '../App.styles';

const Overlay = ({onRequest}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          opacity: pressed && 0.9 || 1,
        },
        styles.button
      ]}
      onPress={onRequest}
    >
      <Text style={styles.text}>Get wallet</Text>
    </Pressable>
  );
};

export default Overlay;
