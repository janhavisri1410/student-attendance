import React from 'react';
import { View, StyleSheet } from 'react-native';

const SCard = ({ children, style }) => {
  const { container } = styles;
  return <View style={{ ...container, ...style }}>{children}</View>;
};

const styles = new StyleSheet.create({
  container: {
    height: 55,
    width: '90%',
    marginTop: 10,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});

export { SCard };
