import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
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
    position: 'absolute',
    top: '70%',
    alignSelf: 'center',
    fontSize: 20,
    color: 'black',
    backgroundColor: 'white',
    padding: 10,
  }
});

const cborconst = 'bf6376657265312e322e31636e616dbf62666e754d7573746572667261752d47c3b6c39f696e67657263666e74754d5553544552465241553c474f455353494e47455262676e684761627269656c6563676e74684741425249454c45ff63646f626a313939382d30322d323661769fbf627467693834303533393030366276706a31313139333439303037626d706c45552f312f32302f31353238626d616d4f52472d31303030333032313562646e01627364026264746a323032312d30322d313862636f624154626973781b4d696e6973747279206f66204865616c74682c2041757374726961626369783155524e3a555643493a30313a41543a31303830373834334639344145453045453530393346424332353442443831332342ffffff';

const App = () => {
  const [link, setLink] = useState();

  return (
    <SafeAreaView style={styles.root}>
      <RNCamera
        style={styles.camera}
        captureAudio={false}
        // onGoogleVisionBarcodesDetected={_onBarcodeRecognized}
        onBarCodeRead={(info) => {
          if (info) {
            console.log(info);
            setLink(info.data);
  
            // const decoded = decode(Buffer.from(cborconst, 'hex'));

            const based = base45.decode(info.data.slice(4));
            const zlibed = zlib.inflate(based);
            // base = info.data.slice(4);
            // console.log(based);
            // console.log(zlibed);

            const cbored1 = cbor.decode(zlibed.buffer);
            // console.log(cbored1);
            
            const cbored1part = Buffer.from(cbored1[2]);
            console.log(cbor.decode(cbored1part.buffer));
          }
        }}
      >
      </RNCamera>

      {link &&
        <Text style={styles.text}>{link}</Text>
      }
    </SafeAreaView>
  );
};

export default App;
