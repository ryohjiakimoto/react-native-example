'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  TouchableHighlight
} from 'react-native';

import EntryList from './EntryList';
import { Const } from './Const';

const ITEM_URL = Const.BUCKET_URL + '/item_info.json';

export default class TagList extends Component {
  constructor(props) {
    super(props);
    this.state = {
        dataSource: new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2
        })
    };
  };

  fetchData = () => {
    fetch(ITEM_URL)
	  .then((response) => response.json())
	  .then((responseData) => {
	      this.setState({
		  dataSource: this.state.dataSource.cloneWithRows(responseData)
	      });
	  })
	  .done();
  };

  componentDidMount() {
    this.fetchData();
  }

  renderEntry = (entry, sectionID, rowID) => {
    let rank = Number(rowID) + 1;
    return (
      <TouchableHighlight onPress={() => this.onPressed(entry)}>
        <View>
          <View style={styles.container}>
            <Image
              source={{uri: entry.icon_url}}
              style={styles.thumbnail} />
            <View style={styles.rightContainer}>
              <Text style={styles.title}>{rank}. {entry.id}</Text>
              <Text style={styles.textinfo}>{entry.d_items_count} new items, {entry.d_followers_count} new followers</Text>
            </View>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  };

  onPressed = (entry) => {
    this.props.navigator.push({
      title: entry.id,
      component: EntryList,
      passProps: { url: 'https://qiita.com/api/v2/tags/' + entry.id + '/items' }
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
        width: 50,
        height: 50,
        marginRight: 10
    },
    rightContainer: {
        flex: 1
    },
    title: {
        fontSize: 20,
        marginBottom: 8
    },
    textinfo: {
        fontSize: 16,
        marginBottom: 8,
	color: '#808080'
    },
    separator: {
       height: 0.8,
       backgroundColor: '#DDDDDD'
    },
    listView: {
       backgroundColor: '#F5FCFF'
    }
});
