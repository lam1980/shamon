// #region snippet-config
const Parcel = require('@oasislabs/parcel-sdk');
const fs = require('fs');

const configParams = Parcel.Config.paramsFromEnv();
const config = new Parcel.Config(configParams);

const upload = async text => {
  const identityAddress = Parcel.Identity.addressFromToken(await config.tokenProvider.getToken());
  // Let's connect to the identity.
  const identity = await Parcel.Identity.connect(identityAddress, config);
  const datasetMetadata = {
    title: 'Bill'
  };

  // The dataset: 'hooray!', encoded as a Uint8Array.
  const data = new TextEncoder().encode(text);
  const dataset = await Parcel.Dataset.upload(data, datasetMetadata, identity, config);
  return dataset.address;
};

const getData = async address => {
  const identityAddress = Parcel.Identity.addressFromToken(await config.tokenProvider.getToken());
  // Let's connect to the identity.
  const identity = await Parcel.Identity.connect(identityAddress, config);
  const datasetToDownload = await Parcel.Dataset.connect(address, identity, config);

  const secretDataStream = datasetToDownload.download();
  const secretDatasetWriter = secretDataStream.pipe(fs.createWriteStream('./user_data'));

  // Utility method.
  const streamFinished = require('util').promisify(require('stream').finished);
  try {
    await streamFinished(secretDatasetWriter);
  } catch (e) {
    throw new Error(`Failed to download dataset at ${datasetToDownload.address.hex}`);
  }
  const secretData = fs.readFileSync('./user_data').toString();
  console.log(secretData);
  return secretData;
};

// upload('helloooooo').then(e => getData(e));
