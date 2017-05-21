'use strict';

import React, { Component } from 'react';
import {
  WebView
} from 'react-native';

export default class EntryDetail extends Component {
  render() {
    return (
      <WebView
        source={{uri: this.props.url}}
      />
    );
  }
}
