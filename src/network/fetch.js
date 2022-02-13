import PassKit, { AddPassButton } from 'react-native-passkit-wallet'

const CERT_URL = 'https://d412l01u3g.execute-api.eu-central-1.amazonaws.com/prod/pkpass1';
const BASE64_REGEX = /(?<=base64,).*/gms;

class Fetch {
  getPass = async (data) => {
    const startTime = new Date();
    console.log('fetch data start: ', data);

    PassKit.canAddPasses()
      .then((canAdd) => {
        console.log('can add passes: ', canAdd);

        if (canAdd) {
          const params = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            isBase64Encoded: false,
            cache: 'no-cache',
          };

          console.log(params);

          fetchAsBlob(CERT_URL, params)
            .then(convertBlobToBase64)
            .then(base64 => {
              const parts = base64?.match(BASE64_REGEX);

              const actualBase = parts && parts[0];

              if (actualBase) {
                PassKit.addPass(actualBase);
              } else {
                console.error('Error reading base64 regex: ', base64);
              }
            })
            .catch((e) => {
              console.error('request error: ', e);
            })
            .finally(() => {
              const finishTime = new Date();
              console.log('request time: ', finishTime - startTime + 'ms');
            });
        }
      });
  }
}

const fetchAsBlob = (url, params) => fetch(url, params)
  .then(response => response.blob());

const convertBlobToBase64 = blob => new Promise((resolve, reject) => {
  const reader = new FileReader;
  reader.onerror = reject;
  reader.onload = () => {
      resolve(reader.result);
  };
  reader.readAsDataURL(blob);
});

const FetchInstance = new Fetch();
export default FetchInstance;
