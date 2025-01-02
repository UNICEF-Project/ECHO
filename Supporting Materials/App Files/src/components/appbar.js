import React from 'react';
import {Appbar} from 'react-native-paper';
import {useNavigation, StackActions} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function CustomAppbar({navigation, back}) {
  const handleLogout = () => {
    navigation.dispatch(StackActions.popToTop());
    navigation.navigate('LoginScreen');
  };

  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title="Ecolight" />
      {back ? <Appbar.Action icon="logout" onPress={handleLogout} /> : null}
    </Appbar.Header>
  );
}
