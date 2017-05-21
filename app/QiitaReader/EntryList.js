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

export default class EntryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
        dataSource: new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2
        })
    };
  }

  fetchData = (url) => {
    fetch(url)
	  .then((response) => response.json())
	  .then((responseData) => {
	      this.setState({
		  dataSource: this.state.dataSource.cloneWithRows(responseData)
	      });
	  })
	  .done();
  };

  componentDidMount() {
    this.fetchData(this.props.url);
  }

  renderEntry = (entry, sectionID, rowID) => {
    return (
      <TouchableHighlight onPress={() => this.onPressed(entry)}>
        <View>
          <View style={styles.container}>
            <Image
              source={{uri: entry.user.profile_image_url}}
              style={styles.thumbnail} />
            <View style={styles.rightContainer}>
              <Text style={styles.title}>{entry.title}</Text>
              <Text style={styles.name}>{entry.user.id}</Text>
            </View>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  };

  onPressed = (entry) => {
    Realm.write(() => {
      Realm.create('History',
   		   {
                     title: entry.title,
   		     url: entry.url,
   		     userId: entry.user.id,
   		     profileImageUrl: entry.user.profile_image_url,
   		     accessTime: new Date()
   		   },
                   true);
    });
    this.props.navigator.push({
      title: entry.title,
      component: EntryDetail,
      passProps: { url: entry.url }
    })
  };

  render() {
    return (
      <ListView
        style={styles.listView}
        dataSource={this.state.dataSource}
        renderRow={this.renderEntry}
      />
    );
  }
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
