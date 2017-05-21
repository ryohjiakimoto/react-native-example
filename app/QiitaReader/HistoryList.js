'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight
} from 'react-native';

import EntryDetail from './EntryDetail';

import Realm from './Realm';
import { ListView } from 'realm/react-native';

const baseDataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2
});

export default class HistoryList extends Component {

  renderEntry = (entry) => {
    return(
      <TouchableHighlight onPress={() => this.onPressed(entry)}>
        <View>
          <View style={styles.container}>
            <Image
              source={{uri: entry.profileImageUrl}}
              style={styles.thumbnail} />
            <View style={styles.rightContainer}>
              <Text style={styles.title}>{entry.title}</Text>
              <Text style={styles.name}>{entry.userId}</Text>
            </View>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  };

  onPressed = (entry) => {
    console.log('a');
    this.props.navigator.push({
      title: entry.title,
      component: EntryDetail,
      passProps: { url: entry.url }
    });
  };

  render() {
    let entries = Realm.objects('History').sorted('accessTime', true);
    return (
      <ListView
        style={styles.listView}
        dataSource={baseDataSource.cloneWithRows(entries.slice(0,20))}
        renderRow={this.renderEntry}
      />
    );
  };
}

const styles = StyleSheet.create({
    container: {
	flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        padding: 10
    },
    thumbnail: {
        width: 100,
        height: 100,
        marginRight: 10
    },
    rightContainer: {
        flex: 1
    },
    title: {
        fontSize: 20,
        marginBottom: 8
    },
    name: {
        color: '#656565'
    },
    separator: {
       height: 1,
       backgroundColor: '#DDDDDD'
    },
    listView: {
       backgroundColor: '#F5FCFF'
    }
});
