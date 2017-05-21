'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
} from 'react-native';

import EntryList from './EntryList';

export default class SearchEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagName: '',
      errorMessage: ''
    }
  }

  tagInput(evt) {
    this.setState(
      {
        tagName: evt.nativeEvent.text,
      }
    );
  }

  searchEntry() {
    this.fetchData();
  }

  fetchData() {
    if (this.state.tagName !=='') {
      var searchUrl = 'https://qiita.com/api/v2/tags/' + this.state.tagName + '/items';
      this.props.navigator.push({
        title: 'Search Results',
        component: EntryList,
        passProps: {url: searchUrl}
      });
    } else {
      this.setState({ errorMessage: 'Please enter search tag'});
    }
  }

  render() {
    return (
	<View style={styles.container}>
        <View>
          <Text style={styles.instructions}>Search by tag</Text>
          <View>
            <TextInput style={styles.searchInput} onChange={(e) => this.tagInput(e)} />
          </View>
        </View>
        <TouchableHighlight style={styles.button} underlayColor='#f1c40f'>
          <Text style={styles.buttonText} onPress={() => this.searchEntry()}>
            Search
          </Text>
        </TouchableHighlight>
	  <Text style={styles.errorMessage}>
            {this.state.errorMessage}
          </Text>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    marginTop: 65,
    padding: 10
  },
  description: {
    fontSize: 18,
    backgroundColor: "#FFFFFF"
  },
  instructions: {
    fontSize: 18,
    alignSelf: 'center',
    marginBottom: 15
  },
  searchInput: {
    height: 36,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 4,
    padding: 5
  },
  button: {
    height: 36,
    backgroundColor: '#6495ED',
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 15
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  errorMessage: {
    fontSize: 15,
    alignSelf: 'center',
    marginTop: 15,
    color: '#FF4500'
  },
});
