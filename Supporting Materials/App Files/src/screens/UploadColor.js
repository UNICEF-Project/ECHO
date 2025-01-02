import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  Image,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {Dimensions} from 'react-native';
import {ColorDetector, uploadImage} from '../api/api';
import {launchImageLibrary} from 'react-native-image-picker';
import {Button} from 'react-native-paper';

const UploadColor = ({navigation}) => {
  const imageRef = useRef('');
  const [imageUri, setImageUri] = useState(
    'https://thumbs.dreamstime.com/b/thin-line-black-camera-logo-like-upload-your-photo-thin-line-black-camera-logo-like-upload-your-photo-graphic-art-design-element-106033006.jpg',
  );
  const [pressedCoords, setPressedCoords] = useState({x: null, y: null});
  const [imageWidth, setImageWidth] = useState(null);
  const [imageHeight, setImageHeight] = useState(null);
  const [url, seturl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(false);
  let s;
  const options = {
    title: 'Load Photo',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  const handlePress = event => {
    const {pageX, pageY} = event.nativeEvent;
    console.log(pageX);
    console.log(pageY);
    imageRef.current.measure((fx, fy, width, height, px, py) => {
      const x = pageX - px;
      const y = pageY - py;
      setPressedCoords({x: x, y: y});
      console.log('Clicked at: ', x, y);
    });
  };

  const screenWidth = Dimensions.get('screen').width;
  const pick = async () => {
    launchImageLibrary(options, response => {
      if (!response.didCancel) {
        setImageUri(response.assets[0].uri);
        setImageWidth(response.assets[0].width);
        setImageHeight(response.assets[0].height);
        setLoading(true);
        uploadImage(response.assets[0].uri).then(res => {
          console.log('gcfgcrtc', res);
          seturl(res);
          setLoading(false);
        });
      }
    });
    console.log(screenWidth);
  };

  const DetectColor = () => {
    setLoading(true);
    ColorDetector(
      url,
      pressedCoords.x,
      pressedCoords.y,
      screenWidth,
      screenWidth / s,
      (err, res) => {
        if (err) console.log(err);
        else {
          setResult(res);
        }
        setLoading(false);
      },
    );
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {loading && <Text>Loading...</Text>}
      {!loading && (
        <>
          <View style={styles.innerContainer}>
            {imageUri && (
              <TouchableHighlight onPress={handlePress}>
                <Image
                  style={{
                    width: '100%',
                    height: undefined,
                    aspectRatio:
                      imageWidth && imageHeight
                        ? (s = imageWidth / imageHeight)
                        : 1,
                  }}
                  ref={imageRef}
                  source={{uri: imageUri}}
                />
              </TouchableHighlight>
            )}
          </View>
          <View
            style={[
              styles.innerContainer,
              {marginTop: 25, flexDirection: 'row'},
            ]}>
            <Button mode="contained" onPress={pick}>
              <Text style={{color: 'white'}}>Upload Image</Text>
            </Button>
            <Button
              mode="contained"
              onPress={DetectColor}
              style={{marginLeft: '4%'}}>
              <Text style={{color: 'white'}}>Detect Color</Text>
            </Button>
          </View>
          <View style={[styles.innerContainer, {marginTop: 25}]}>
            {pressedCoords.x && pressedCoords.y && (
              <Text style={{fontSize: 16}}>
                Pressed: x={pressedCoords.x.toFixed(2)}, y=
                {pressedCoords.y.toFixed(2)}
              </Text>
            )}
            {!loading && result ? (
              <Text style={styles.header2}>{result.Result.Color}</Text>
            ) : (
              <Text></Text>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default UploadColor;

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
