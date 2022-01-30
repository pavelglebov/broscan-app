const CERT_URL = 'https://d412l01u3g.execute-api.eu-central-1.amazonaws.com/prod/pkpass1';

class Fetch {
  getPass(data) {
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
  }
}

const FetchInstance = new Fetch();
export default FetchInstance;
