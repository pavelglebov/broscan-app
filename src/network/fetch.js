import PassKit, { AddPassButton } from 'react-native-passkit-wallet'
import RNFetchBlob from 'rn-fetch-blob';

const CERT_URL = 'https://d412l01u3g.execute-api.eu-central-1.amazonaws.com/prod/pkpass1';

class Fetch {
  getPass = async (data) => {
    const startTime = new Date();
    console.log(data);

    console.log(JSON.stringify(data));
    const obj = JSON.parse(JSON.stringify(data));

    PassKit.canAddPasses()
      .then((result) => {
        console.log('canAddPasses', result);

        RNFetchBlob.fetch('POST', CERT_URL, {
          'Content-Type': 'multipart/form-data',
          'Cache-Control' : 'no-store',
          'cache': 'no-cache',
        }, [{
          name: 'data',
          data: obj,
          type: 'application/json'
        }])
          .then(async (res) => {
            if (res.respInfo?.status !== 200) {
              console.error('Request failed with code ' + res.respInfo?.status, res);
              return;
            }

            console.log('request result: ', res);
            PassKit.addPass(res.data);
          })
          .catch((errorMessage, statusCode) => {
            console.error('request error: ', errorMessage);
          });
      });

    // const result = await RNFetchBlob.config()
    //   .fetch(
    //     'POST',
    //     CERT_URL,
    //     {},
    //     JSON.parse(JSON.stringify(data))
    //   );

    //   console.log('result', result);

    // const resultShare = await showAddPassControllerFromFile(result.data);

    // RNFetchBlob.fetch('GET', CERT_URL, {
    //   appendExt : 'pkpass'
    // })
    //   .then(async (res) => {
    //     console.log(res);
    //     const result = await Wallet.showAddPassControllerFromFile(res.data);
    //   })
    //   // Something went wrong:
    //   .catch((errorMessage, statusCode) => {
    //     console.error('request error: ', errorMessage);
    //   });

  //   fetch(CERT_URL, {
  //     body: JSON.parse(JSON.stringify(data)),
  //     cache: 'no-cache',
  //     headers: {
  //       'content-type': 'application/json'
  //     },
  //     method: 'POST',
  //   })
  //   .then((response) => {
  //     console.log('response', response);

  //     response.blob().then(function(myBlob) {

  //       try {
  //       // https://github.com/erikpoort/react-native-wallet

  //         const blob = JSON.stringify(response.blob());

  //         console.log('blob', blob);
  //         PassKit.addPass(blob);
  //       } catch (err) {
  //         console.log('showAddPassControllerFromFile error', err);
  //       }
  //     });
  //   })
  //   .catch((e) => {
  //     console.error('request error: ', e);
  //   })
  //   .finally(() => {
  //     const finishTime = new Date();
  //     console.log('request time: ', finishTime - startTime + 'ms');
  //   });
  }
}

const FetchInstance = new Fetch();
export default FetchInstance;
