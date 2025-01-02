import {StyleSheet, ActivityIndicator, View} from 'react-native';
import React, {useState, useEffect, Component} from 'react';
import {Text} from 'react-native-paper';
import {Get_location} from '../api/api';
import {TableWrapper, Row, Cell} from 'react-native-table-component';
import Toast from '../components/Toast';
import {Linking} from 'react-native';

export default function Location({navigation}) {
  const [loc, setloc] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const tableHead = ['id', 'Link'];

  useEffect(() => {
    setLoading(true);
    Get_location((err, data) => {
      if (err) {
        console.log(err);
        setError(true);
        return;
      } else {
        delete data['Real Time Data'].Alarm;
        setloc(data['Real Time Data']);
        console.log(loc);
        console.log(data['Real Time Data']);
        setLoading(false);
      }
    });
  }, []);

  return (
    <View
      style={{
        height: '100%',
        width: '90%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 20,
      }}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {loading && <Text>Loading...</Text>}
      {!loading && <Text style={styles.header}>Location</Text>}
      {/* <Table borderStyle={{borderColor: 'transparent'}}> */}
      {error && <Toast type="error" message={'Could not Load Location'} />}
      {!loading && !error && (
        <Row data={tableHead} style={styles.head} textStyle={styles.heading} />
      )}
      {!loading &&
        !error &&
        Object.keys(loc).map((key, i) => {
          return (
            <TableWrapper key={i + 9} style={styles.row}>
              <Cell key={i + 10} data={key} textStyle={styles.text} />
              <Cell
                key={i + 20}
                data={
                  'https://www.google.com/maps/search/?api=1&query=' +
                  loc[key].lat +
                  loc[key].lng
                }
                onPress={() =>
                  Linking.openURL(
                    'https://www.google.com/maps/search/?api=1&query=' +
                      loc[key].lat +
                      loc[key].lng,
                  )
                }
                textStyle={styles.text}
              />
            </TableWrapper>
          );
        })}
      {/* </Table> */}
    </View>
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
    marginBottom: 20,
  },
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  head: {
    height: 40,
    backgroundColor: '#0259d8',
    textAlign: 'center',
    color: 'white',
    borderRadius: 5,
  },
  heading: {
    margin: 6,
    textAlign: 'center',
    color: 'white',
    marginLeft: 2,
    marginRight: 2,
  },
  text: {margin: 6, textAlign: 'center'},
  row: {
    flexDirection: 'row',
    backgroundColor: 'white',
    textAlign: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginLeft: 2,
    marginRight: 2,
  },
  btn: {
    width: 58,
    height: 22,
    backgroundColor: '#0259d8',
    borderRadius: 8,
    textAlign: 'center',
    alignContent: 'center',
  },
  btnText: {textAlign: 'center', color: '#fff'},
});
