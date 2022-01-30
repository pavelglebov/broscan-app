import {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
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
