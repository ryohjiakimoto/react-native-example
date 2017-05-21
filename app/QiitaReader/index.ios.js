'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TabBarIOS
} from 'react-native';

import TagTab from './TagTab';
import SearchTab from './SearchTab';
import HistoryTab from './HistoryTab';

class QiitaReader extends Component {

  constructor(props) {
    super(props);
    this.state = {
        selectedTab: 'TagTab'
    };
  }

  render() {
    return (
      <TabBarIOS style={styles.container} selectedTab={this.state.selectedTab}>
        <TabBarIOS.Item
          selected={this.state.selectedTab === 'TagTab'}
	  systemIcon='featured'
          onPress={() => {
            this.setState(
              {selectedTab: 'TagTab'}
            );
          }}
        >
          <TagTab />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          selected={this.state.selectedTab === 'SearchTab'}
	  systemIcon='search'
          onPress={() => {
            this.setState(
              {selectedTab: 'SearchTab'}
            );
          }}
        >
          <SearchTab />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          selected={this.state.selectedTab === 'HistoryTab'}
	  systemIcon='history'
          onPress={() => {
            this.setState(
              {selectedTab: 'HistoryTab'}
            );
          }}
        >
          <HistoryTab />
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});

AppRegistry.registerComponent('QiitaReader', () => QiitaReader);
