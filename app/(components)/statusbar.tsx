import React from 'react';
import { Platform, StatusBar, View, StyleSheet } from 'react-native';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44;

const SafeStatusBar = ({ backgroundColor = '#fff' }: { backgroundColor?: string }) => (
  <View style={[styles.statusBar, { backgroundColor }]} />
);

const styles = StyleSheet.create({
  statusBar: {
    height: STATUS_BAR_HEIGHT,
    width: '100%',
  },
});

export default SafeStatusBar;
