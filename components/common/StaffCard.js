import React from 'react';
import { View, StyleSheet } from 'react-native';

const StaffCard = ({ children, style }) => {
  const { container } = styles;
  return <View style={{ ...container, ...style }}>{children}</View>;
};

const styles = new StyleSheet.create({
  container: {
    height: 45,
    marginTop: 10,
    marginRight: 10,
    borderWidth: 3,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});

export { StaffCard };
