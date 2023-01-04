import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const PrijaviMeBtn = ({ onPress, children }) => {
  const { button, text } = styles;
  return (
    <View>
      <TouchableOpacity onPress={onPress} style={button}>
        <Text style={text}>
          {children}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  text: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    padding: 10
  },
  button: {
    backgroundColor: "rgb(0, 132, 208)",
    marginBottom: 15,
    marginRight: 7,
    borderRadius: 5,
    marginTop: 10,
    marginRight: 7
  }
};

export { PrijaviMeBtn };