'use strict';

import React, {Component,useState, useRef} from 'react';
import {View, Text, PermissionsAndroid ,ActivityIndicator, TouchableOpacity ,TouchableHighlight , Image,Dimensions, StyleSheet, Modal} from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures-plus';
import * as ImagePicker from "react-native-image-picker"
import Tts from 'react-native-tts';
import { ColorDetector,uploadImage, CurrencyDetector, ObjectDetector } from '../api/api';
import { ScreenHeight } from 'react-native-elements/dist/helpers';
import DocumentScanner from 'react-native-document-scanner-plugin'
// import TesseractOcr, { LANG_ENGLISH } from 'react-native-tesseract-ocr';
import * as Progress from 'react-native-progress';
import DocumentPicker from 'react-native-document-picker';
// import { PDFDocument } from 'react-native-pdf-lib';
import TextRecognition from 'react-native-text-recognition';
import { BackgroundImage } from 'react-native-elements/dist/config';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';


export default function DashboardTemp() {
  const [myText, setMyText] = React.useState("I'm ready to get swiped!");
  const [gestureName, setGestureName] = React.useState('none');
  const [backgroundColor, setBackgroundColor] = React.useState('#fff');
  const [url, seturl] = useState('');
  const [pressedCoords, setPressedCoords] = useState({x: null, y: null});
  const [result, setResult] = useState(false);
  const [scannedImage, setScannedImage] = useState();
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');

  const [colormodal, setcolormodal]= useState(false)

  const imageRef = useRef('');
  const [imageUri, setImageUri] = useState(
    'https://thumbs.dreamstime.com/b/thin-line-black-camera-logo-like-upload-your-photo-thin-line-black-camera-logo-like-upload-your-photo-graphic-art-design-element-106033006.jpg',

  );
  const [imageWidth, setImageWidth] = useState(null);
  const [imageHeight, setImageHeight] = useState(null);


  const screenWidth = Dimensions.get('screen').width;
  let s;


  const tessOptions = {};

  const scanDocument = async () => {
    // start the document scanner
    const { scannedImages } = await DocumentScanner.scanDocument()
  
    // get back an array with scanned image file paths
    if (scannedImages.length > 0) {
      // set the img src, so we can view the first scanned image
      setScannedImage(scannedImages[0])
      console.log(JSON.stringify(scannedImages[0]));
      // TesseractOcr.recognize(scannedImages[0], LANG_ENGLISH, tessOptions);

    }
  }

  const handlePickDocument = async () => {
    TakePhoto()
  }

  const handlePress = event => {
    const {pageX, pageY} = event.nativeEvent;
    console.log(pageX);
    console.log(pageY);
    imageRef.current.measure((fx, fy, width, height, px, py) => {
      const x = pageX - px;
      const y = pageY - py;
      setPressedCoords({x: x, y: y});
      console.log('Clicked at: ', x, y);
      Tts.speak('Clicked on Image Please Wait')

      DetectColor(x,y)
    });
  };

  const DetectColor = (x,y) => {
    ColorDetector(
      url,
      x,
      y,
      screenWidth,
      screenWidth / s,
      (err, res) => {
        if (err) console.log(err);
        else {
          setResult(res);
          Tts.speak('Color detection result is '+res.Result.Color)

          console.log('result', res);
        }
      },
    );
  };

  const DetectCurrency = (url) => {
    setLoading(true)
    console.log('start');
    console.log(url);
    CurrencyDetector(url, (err, res) => {
      setLoading(false)


      if (err) {
        console.log(err);

      }
      else {
        setResult(res);
        Tts.speak('Currency detection result is '+res.result)
        console.log(res);
      }
    });
  };

  const DetectObject = (url) => {
    console.log("start");
  ObjectDetector(url, (err, res) => {
                setLoading(false)

      if (err) console.log(err);
      else {
        // setImageSource(res.url);
        setResult(res.Objtects);
        let h = res.Objtects
        Tts.speak('Result is '+JSON.stringify(h))
        console.log(res);
      }
    });
  };

  const onSwipeUp = async (gestureState) => {
     setMyText('You swiped up!');
 Tts.speak('You swiped up')


    TakePhoto('up')
    // Tts.speak('You swiped up')

  };

  const onSwipeDown = (gestureState) => {
    Tts.speak('You swiped Down')
    TakePhoto('down')
    // Tts.speak('You swiped down')
    setMyText('You swiped down!');
  };

  const onSwipeLeft = (gestureState) => {
    Tts.speak('You swiped left')
    TakePhoto('left')
    // scanDocument()
    // handlePickDocusment()
    setMyText('You swiped left!');
  };
  const onSwipeRight = (gestureState) => {
    Tts.speak('You swiped right')

    TakePhoto('right')
    // Tts.speak('You swiped right')
    setMyText('You swiped right!');
  };

  const onPress = (gestureState) => {
    setMyText('You Clicked!');
  };

  const onLongPress = (gestureState) => {
    setMyText('You Long Pressed!');
  };

  const onLongPressRelease = (gestureState) => {
    setMyText('You Long Pressed Released!');
  };

  const onSwipe = (gestureName, gestureState) => {
    const {
      SWIPE_UP,
      SWIPE_DOWN,
      SWIPE_LEFT,
      SWIPE_RIGHT,
      ON_PRESS,
      ON_LONGPRESS,
      ON_LONGPRESS_RELEASE,
    } = swipeDirections;
    setGestureName(gestureName);
    switch (gestureName) {
      case SWIPE_UP:
        setBackgroundColor('red');
        break;
      case SWIPE_DOWN:
        setBackgroundColor('green');
        break;
      case SWIPE_LEFT:
        setBackgroundColor('blue');
        break;
      case SWIPE_RIGHT:
        setBackgroundColor('yellow');
        break;
      case ON_PRESS:
        setBackgroundColor('black');
        break;
      case ON_LONGPRESS:
        setBackgroundColor('pink');
        break;
      case ON_LONGPRESS_RELEASE:
        setBackgroundColor('pink');
        break;
    }
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  const extractTextFromPDF = async (pdfPath) => {
    console.log('fsfskf,', pdfPath);
    // const pdfDoc = await PDFDocument.load({ uri: pdfPath });
    // const text = await pdfDoc.getText();
    // console.log(text);
    // Handle the extracted text
  };

  const TakePhoto = async (value) => {
    Tts.speak('Please Take The Picture')
    let options = {
      quality: 0.6,
      saveToPhotos: true,
    };
      let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      ImagePicker.launchCamera(options, async (response) => {

        Tts.speak('Please Wait While We are processing')

        console.log('Response = ', response);
        if (response.didCancel) {
          Tts.speak('User cancelled camera picker')
          // alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          Tts.speak('Camera not available on device')

          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          Tts.speak('Permission not satisfied')

          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          Tts.speak(response.errorMessage)

          alert(response.errorMessage);
          return;
        }else{
          // img.push(response)
          // setEditImages(old => [...old, ...img]);
          // setimg([])
          // value.append('vehicle_image[]',{uri:response.uri,
          //   name:response.fileName,
          //   type:response.type
          // } )

          setLoading(true)
          setImageUri(response.assets[0].uri);
          setImageWidth(response.assets[0].width);
          setImageHeight(response.assets[0].height);
          console.log('res',response);
          if(value == 'left'){
            console.log('uri',response.assets[0].uri );
            let result = await TextRecognition.recognize(response.assets[0].uri);
            if(result.length>0){
              result = JSON.stringify(result)
              console.log('reslt', result);

              Tts.speak('Text recognized is'+result)

            }

            setLoading(false)
          }else{
           uploadImage(response.assets[0].uri).then(async res => {
            console.log('gcfgcrtc', res);
            seturl(res);
            if(value == 'up'){
              setLoading(false)
              // DetectColor(res)
              Tts.speak('Please click on Image to Detect Color')
              setcolormodal(true)
            }else if(value == 'down'){
              DetectObject(res)
            }else if(value == 'right'){
              DetectCurrency(res)
            }

          });
        }

          // DetectColor()
          // setopener(false)
        }
      });
    }
  
  };

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
    swipeEnabled: true,
    longpressDelay: 700,
  };

  return (<>
    {loading &&   <ActivityIndicator size="large"  style={{position:'absolute',zIndex:1,  justifyContent:'center', alignItems:'center', alignSelf:'center'}} color="#0000ff" />}


{/* <Image
      resizeMode="contain"
      
      source={{uri:scannedImage}}
    /> */}
  <Modal visible={colormodal} style={{backgroundColor:'purple', height:ScreenHeight, width:screenWidth}} >
   <TouchableOpacity style={{marginLeft:50, position:'absolute', marginTop:50}} onPress={()=> {setcolormodal(false)}}>
   <Text>Close</Text>
    </TouchableOpacity> 
   
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
  </Modal>
 

 
    <GestureRecognizer
      onSwipe={(direction, state) => onSwipe(direction, state)}
      onSwipeUp={(state) => onSwipeUp(state)}
      onSwipeDown={(state) => onSwipeDown(state)}
      onSwipeLeft={(state) => onSwipeLeft(state)}
      onSwipeRight={(state) => onSwipeRight(state)}
      onPress={(state) => onPress(state)}
      onLongPress={(state) => onLongPress(state)}
      onLongPressRelease={(state) => onLongPressRelease(state)}
      config={config}
      gestureStyle={{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: 'transparent',
      }}
      style={{
        flex: 1,
        backgroundColor: backgroundColor,
      }}>
      {/* <Text>{myText}</Text> */}
      <View style={{ height:'100%', width:'100%'}}>
      <View style={{height:'30%',  justifyContent:'space-evenly', alignItems:'center', width:'100%'}}>
      <FontAwesome name='angle-double-up' color="grey" size={50}/>
      <Text >Swipe Up For Color Detection</Text>
      </View>

      <View style={{height:'40%',justifyContent:'center', flexDirection:'row', justifyContent:'center', alignItems:'center', width:'100%'}}>
     <View style={{width:'50%',height:'100%',justifyContent:'space-evenly', alignItems:'center',flexDirection:'row',}}>
     <FontAwesome name='angle-double-left' color="grey" size={50}/>

     <Text style={{width:'40%', textAlign:'center'}}>Swipe Left For Doc Scanner </Text>

     </View>

     <View style={{width:'50%',height:'100%',justifyContent:'space-evenly',alignItems:'center', flexDirection:'row', }}>


      <Text style={{width:'40%', textAlign:'center'}}>Swipe right For Currency Detection</Text>
      <FontAwesome name='angle-double-right' color="grey" size={50}/>

      </View>
       </View>
       <View style={{height:'30%', justifyContent:'space-evenly', alignItems:'center', width:'100%'}}>


      <Text>Swipe Down For Object Detection</Text>
      <FontAwesome name='angle-double-down' color="grey" size={50}/>

      </View>
      </View>
      
    </GestureRecognizer>

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',height:'100%',
    width:'100%',
    marginTop: 5,
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