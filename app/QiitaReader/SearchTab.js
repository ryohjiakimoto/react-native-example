'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  NavigatorIOS
} from 'react-native';

import SearchEntry from './SearchEntry';

export default class SearchTab extends Component {
  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Search Entries',
          component: SearchEntry
        }} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
