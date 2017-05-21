'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  NavigatorIOS
} from 'react-native';

import HistoryList from './HistoryList';

export default class HistoryTab extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'History Entries',
          component: HistoryList,
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
