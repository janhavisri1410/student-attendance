import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// 
const SubjectBtn = ({ onPress, children, style, btnStyle, txtStyle }) => {
  const { button, text } = styles;
  return (
    <View style={style}>
      <TouchableOpacity onPress={onPress} style={{ justifyContent: 'center' }}>
        <Text style={{ ...text, ...txtStyle }}>{children}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = new StyleSheet.create({
  text: {
    alignSelf: 'center',
    color: '#009387',
    fontSize: 18,
    fontWeight: '700',
    zIndex: 0,
  },
  button: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 5,
    borderWidth: 3,
    borderColor: '#009387',
    backgroundColor: 'white',
    borderRadius: 10,
    minWidth: 90,
    zIndex: -100000,
  },
});

export { SubjectBtn };
