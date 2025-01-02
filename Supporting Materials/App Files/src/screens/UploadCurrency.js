import React, {useState, useRef} from 'react';
import {
  Alert,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {Text} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import {Button} from 'react-native-paper';
import {CurrencyDetector, uploadImage} from '../api/api';

const UploadCurrency = ({navigation}) => {
  const imageRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [imageSource, setImageSource] = useState(
    'https://thumbs.dreamstime.com/b/thin-line-black-camera-logo-like-upload-your-photo-thin-line-black-camera-logo-like-upload-your-photo-graphic-art-design-element-106033006.jpg',
  );
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(false);
  const options = {
    title: 'Load Photo',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  const showImagePicker = () => {
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setImageSource(response.assets[0].uri);
        setLoading(true);
        uploadImage(response.assets[0].uri).then(r => {
          setUrl(r);
          setLoading(false);
        });
      }
    });
  };
  const DetectCurrency = () => {
    setLoading(true);
    console.log(url);
    CurrencyDetector(url, (err, res) => {
      if (err) console.log(err);
      else {
        setResult(res);
        console.log(res);
      }
      setLoading(false);
    });
  };

  return (
    <View
      style={{
        height: '100%',
        width: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {loading && <Text>Loading...</Text>}
      {!loading && (
        <>
          <TouchableOpacity>
            <Image
              source={{uri: imageSource}}
              style={{width: 300, height: 300}}
              ref={imageRef}
            />
          </TouchableOpacity>
          <View
            style={[
              styles.innerContainer,
              {marginTop: 25, flexDirection: 'row'},
            ]}>
            <Button mode="contained" onPress={showImagePicker}>
              Load Photo
            </Button>
            <Button
              mode="contained"
              onPress={DetectCurrency}
              style={{marginLeft: '4%'}}>
              Detect Currency
            </Button>
          </View>
          {!loading && result ? (
            <Text style={styles.header2}>Rs {result.result}</Text>
          ) : (
            <Text></Text>
          )}
        </>
      )}
    </View>
  );
};

export default UploadCurrency;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  header2: {
    fontWeight: 'bold',
    fontSize: 22,
    marginTop: 20,
  },
  header: {
    marginTop: 20,
    fontWeight: 'bold',
    fontSize: 26,
  },
});
