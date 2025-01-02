import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';





// const firebaseConfig = {
//   apiKey: 'AIzaSyBc4wvrqbKW4HO7B6-gaJ7PgF04QQiqSls',
//   authDomain: 'blind-smart.firebaseapp.com',
//   databaseURL: 'https://blind-smart-default-rtdb.firebaseio.com',
//   projectId: 'blind-smart',
//   storageBucket: 'blind-smart.appspot.com',
//   messagingSenderId: '425749721185',
//   appId: '1:425749721185:web:3c87f9398e9944c266ba20',
//   measurementId: 'G-P6MW70512Z',
// };
 firebaseConfig = {
  apiKey: "AIzaSyAcdoCcjf8q5BwIqePpoNSsyTaBMDgNn3M",
  authDomain: "blindy-278b9.firebaseapp.com",
  databaseURL: "https://blindy-278b9-default-rtdb.firebaseio.com",
  projectId: "blindy-278b9",
  storageBucket: "blindy-278b9.appspot.com",
  messagingSenderId: "967103279796",
  appId: "1:967103279796:web:d938ac60c3075e03085de1",
  measurementId: "G-3198C1MZ2D"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const logoutUser = ({navigation}) => {
  auth().signOut();
  navigation.reset({
    index: 0,
    routes: [{name: 'LoginScreen'}],
  });
};

export const signUpUser = async ({name, email, password, navigation}) => {
  try {
    console.log(email);
    console.log(password);
    const user = await auth().createUserWithEmailAndPassword(email, password);
    console.log('request sent');
    auth().currentUser.updateProfile({
      displayName: name,
    });
    navigation.navigate('Dashboardtemp');
    console.log(user);
    return {user};
  } catch (error) {
    return {
      error: error.message,
    };
  }
};

export const loginUser = async ({email, password, navigation}) => {
  try {
    const user = await auth().signInWithEmailAndPassword(email, password);
    navigation.navigate('Dashboardtemp');
    console.log(user);
    return {user};
  } catch (error) {
    return {
      error: error.message,
    };
  }
};

export const sendEmailWithPassword = async email => {
  try {
    await auth().sendPasswordResetEmail(email);
    return {};
  } catch (error) {
    return {
      error: error.message,
    };
  }
};


