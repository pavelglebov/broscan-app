import React, {useState, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Pressable,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import {Buffer} from 'buffer';
import { encode, decode } from 'cborg';
import base45 from 'base45';
import zlib from 'pako';
import cbor from 'cbor-js';

window.Buffer = Buffer;

const styles = StyleSheet.create({
  root: {
    height: '100%',
    width: '100%',
  },
  camera: {
    flex: 1,
  },
  text: {
    alignSelf: 'center',
    fontSize: 26,
    color: 'white',
    padding: 10,
  },
  button: {
    height: 60,
    width: 200,
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: 'rgb(128, 74, 165)',
    borderRadius: 14,
    justifyContent: 'center',
  }
});

const cborconst = 'bf6376657265312e322e31636e616dbf62666e754d7573746572667261752d47c3b6c39f696e67657263666e74754d5553544552465241553c474f455353494e47455262676e684761627269656c6563676e74684741425249454c45ff63646f626a313939382d30322d323661769fbf627467693834303533393030366276706a31313139333439303037626d706c45552f312f32302f31353238626d616d4f52472d31303030333032313562646e01627364026264746a323032312d30322d313862636f624154626973781b4d696e6973747279206f66204865616c74682c2041757374726961626369783155524e3a555643493a30313a41543a31303830373834334639344145453045453530393346424332353442443831332342ffffff';
const CERT_URL = 'https://d412l01u3g.execute-api.eu-central-1.amazonaws.com/prod/pkpass1';

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

  const onRequest = useCallback(() => {
    const startTime = new Date();

    console.log(JSON.stringify(data));

    fetch(CERT_URL, {
      body: JSON.parse(JSON.stringify(data)),
      cache: 'no-cache',
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
    })
    .then((response) => {
      console.log('response', response);
    })
    .catch((e) => {
      console.error('request error: ', e);
    })
    .finally(() => {
      const finishTime = new Date();
      console.log('request time: ', finishTime - startTime + 'ms');
    });
  }, [data]);

  return (
    <SafeAreaView style={styles.root}>
      <RNCamera
        style={styles.camera}
        captureAudio={false}
        // onGoogleVisionBarcodesDetected={_onBarcodeRecognized}
        onBarCodeRead={(info) => {
          if (info) {
            setQR(info.data);

            // const decoded = decode(Buffer.from(cborconst, 'hex'));

            const based = base45.decode(info.data.slice(4));
            const zlibed = zlib.inflate(based);
            // base = info.data.slice(4);

            const cbored1 = cbor.decode(zlibed.buffer);
            
            const cbored1part = Buffer.from(cbored1[2]);

            const decoded = cbor.decode(cbored1part.buffer);

            const data = retrieveData(decoded);
            setData(data);
            console.log('data', data);
          }
        }}
      >
      </RNCamera>

      {qr &&
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
      }
    </SafeAreaView>
  );
};

export default App;
