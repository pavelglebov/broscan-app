import React, {useState, useCallback} from 'react';
import {
  SafeAreaView,
  Text,
} from 'react-native';
import {Buffer} from 'buffer';
// import { encode, decode } from 'cborg';
import base45 from 'base45';
import zlib from 'pako';
import cbor from 'cbor-js';

import styles from './App.styles';
import Camera from './components/camera';
import Overlay from './components/overlay';
import Fetch from './network/fetch';

// important!
window.Buffer = Buffer;

const App = () => {
  const [qr, setQR] = useState();
  const [data, setData] = useState();

  const retrieveData = useCallback((decoded) => {
    if (!decoded || typeof decoded !== 'object') return null;

    try {
      let target = decoded[-260];

      if (!target) {
        const keys = Object.keys(decoded);

        for (const  i = 0; i < keys.length; i++) {
          if (typeof decoded[keys[i]] === 'object') {
            target = decoded[keys[i]];
            break;
          }
        }
      }

      return target;
    } catch (e) {
      console.error('retrieveData error: ', e);
    }
  }, [data]);

  const onBarCodeRead = (info) => {
    if (info) {
      setQR(info.data);

      const based = base45.decode(info.data.slice(4));
      const zlibed = zlib.inflate(based);

      const cbored1 = cbor.decode(zlibed.buffer);

      const cbored1part = Buffer.from(cbored1[2]);

      const decoded = cbor.decode(cbored1part.buffer);

      const data = retrieveData(decoded);

      data.qr = qr;

      setData(data);

      console.log('data', data);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <Camera onBarCodeRead={onBarCodeRead}/>

      {!qr && <Text style={styles.description}>Scan Covid certificate QR code</Text>}

      {qr && <Overlay onRequest={Fetch.getPass.bind(this, data)}/>}
    </SafeAreaView>
  );
};

export default App;
