import React, {useState, useRef} from 'react';
import {
  Alert,
  StyleSheet,
  ActivityIndicator,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Text} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import {Button} from 'react-native-paper';
import {ObjectDetector, uploadImage} from '../api/api';

const UploadShape = ({navigation}) => {
  const imageRef = useRef(null);
  const [imageSource, setImageSource] = useState(
    'https://thumbs.dreamstime.com/b/thin-line-black-camera-logo-like-upload-your-photo-thin-line-black-camera-logo-like-upload-your-photo-graphic-art-design-element-106033006.jpg',
  );
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(
    'https://thumbs.dreamstime.com/b/thin-line-black-camera-logo-like-upload-your-photo-thin-line-black-camera-logo-like-upload-your-photo-graphic-art-design-element-106033006.jpg',
  );
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
        console.log('res',response);

        setImageSource(response.assets[0].uri);
        setLoading(true);
        uploadImage(response.assets[0].uri).then(r => {
          setUrl(r);
          setLoading(false);
        });
      }
    });
  };
  const DetectObject = () => {
    setLoading(true);
    ObjectDetector(url, (err, res) => {
      if (err) console.log(err);
      else {
        setImageSource(res.url);
        setResult(res.Objects);
        console.log(res);
        setLoading(false);
      }
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
      {!loading && (
        <TouchableOpacity>
          <Image
            source={{uri: imageSource}}
            style={{width: 300, height: 300}}
            ref={imageRef}
          />
        </TouchableOpacity>
      )}
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {loading && <Text>Loading...</Text>}
      {!loading && (
        <View
          style={[
            styles.innerContainer,
            {marginTop: 25, flexDirection: 'row'},
          ]}>
          <Button mode="contained" onPress={showImagePicker}>
            <Text style={{color: 'white'}}>Load Photo</Text>
          </Button>
          <Button
            mode="contained"
            onPress={DetectObject}
            style={{marginLeft: '4%'}}>
            <Text style={{color: 'white'}}>Detect Object</Text>
          </Button>
        </View>
      )}
      {!loading && result ? (
        result.map((r, i) => {
          return (
            <Text key={i} style={styles.header2}>
              {r}
            </Text>
          );
        })
      ) : (
        <Text></Text>
      )}
    </View>
  );
};

export default UploadShape;

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
  },
  header: {
    marginTop: 20,
    fontWeight: 'bold',
    fontSize: 26,
  },
});
