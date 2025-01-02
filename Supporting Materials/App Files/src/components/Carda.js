import React from 'react';
import {Avatar, Button, Card, Text} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import {View} from 'react-native';

const LeftContent = props => <Avatar.Icon {...props} icon="folder" />;
export default function Carda({title, url}) {
  return (
    <Card>
      <Card.Content>
        <Text variant="titleLarge" style={styles.text}>
          {title}
        </Text>
      </Card.Content>
      <View style={{paddingHorizontal: 10}}>
        <Card.Cover source={{uri: url}} />
      </View>
      <Card.Actions></Card.Actions>
    </Card>
  );
}
const styles = StyleSheet.create({
  text: {
    marginTop: 1,
    marginBottom: 5,
  },
});
