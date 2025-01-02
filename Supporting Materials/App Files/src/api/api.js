import axios from 'axios';
import {firebase} from '../helpers/Config';
import {getStorage, ref, getDownloadURL} from 'firebase/storage';

const uploadImage = async imageSource => {
  let link;
  const response = await fetch(imageSource);
  const blob = await response.blob();
  const filename = imageSource.substring(imageSource.lastIndexOf('/') + 1);
  var Ref = firebase.storage().ref().child(filename).put(blob);
  try {
    await Ref.then(async r => {
      console.log(r.ref.fullPath);
      const storage = getStorage();
      const reference = ref(storage, r.ref.fullPath);
      await getDownloadURL(reference).then(x => {
        link = x;
        console.log(x);
      });
    });
  } catch (e) {
    console.log(e);
  }
  return link;
};

const CurrencyDetector = (url, cb) => {
  url = 'http://192.168.18.110:5000/currency_detection?url=' + url;
  console.log(url);
  axios({
    method: 'GET',
    url: url,
  })
    .then(r => {
      cb(null, r.data);
    })
    .catch(err => cb(err, null));
};
const ObjectDetector = (url, cb) => {
  console.log(url);

  axios({
    method: 'GET',
    url: 'http://192.168.18.110:5000/object_detection?url=' + url,
  })
    .then(r => {
      cb(null, r.data);
    })
    .catch(err => cb(err, null));
};
const ColorDetector = async (url, x, y, w, h, cb) => {
  console.log(url);

  // w = w >= 410 ? 410 : w;
  url =
    'http://192.168.18.110:5000/color_detection?url=' +
    url +
    '&x=' +
    x +
    '&y=' +
    y +
    '&height=' +
    h +
    '&width=' +
    w;
  console.log(url);
  axios({
    method: 'GET',
    url: url,
  })
    .then(r => {
      cb(null, r.data);
    })
    .catch(err => cb(err, null));
};

const Get_location = cb => {
  let url = 'http://192.168.18.110:5000/location';
  axios({
    method: 'GET',
    url: url,
  })
    .then(r => {
      cb(null, r.data);
    })
    .catch(err => cb(err, null));
};
export {
  ColorDetector,
  CurrencyDetector,
  ObjectDetector,
  uploadImage,
  Get_location,
};
