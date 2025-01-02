import React from 'react';
import {Provider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {theme} from './src/core/theme';
import {
  UploadShape,
  UploadColor,
  UploadCurrency,
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  Dashboard,
  Location,
} from './src/screens';
import {Map} from './src/screens';
import CustomAppbar from './src/components/appbar';
import DashboardTemp from './src/screens/DashboardTemp';

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="StartScreen"
          screenOptions={{
            header: props => <CustomAppbar {...props} />,
          }}>
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          {/* <Stack.Screen name="Dashboard" component={Dashboard} /> */}
          <Stack.Screen name="Dashboardtemp" component={DashboardTemp} />
          <Stack.Screen name="UploadShape" component={UploadShape} />
          <Stack.Screen name="UploadColor" component={UploadColor} />
          <Stack.Screen name="UploadCurrency" component={UploadCurrency} />
          <Stack.Screen name="Location" component={Location} />
          <Stack.Screen name="Map" component={Map} />
          <Stack.Screen
            name="ResetPasswordScreen"
            component={ResetPasswordScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
