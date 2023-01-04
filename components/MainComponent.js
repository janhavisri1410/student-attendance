import React, { Component } from 'react';
import { View, Button, TouchableOpacity, Text } from 'react-native';
import { CustomButton } from '../components/common/';
import axios from 'axios';
import { Prisustvo } from '../components/StackScreens/Prisustvo';
import { Podesavanja } from './StackScreens/Podesavanja';
import { Predmeti } from './StackScreens/Predmeti';

import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

class MainComponent extends Component {
  constructor(props){
    super(props);
    this.state = {
    };
  }

  render() {
    return (
        <NavigationContainer>
          <Stack.Navigator>
          <Stack.Screen
              name="Prisustvo"
              component={Prisustvo}
              options={ ({ navigation }) => ({
                title: 'Trenutne aktivnosti',
                headerStyle: {backgroundColor: 'rgb(0, 132, 208)'},
                headerTintColor: 'white',
                headerRight: () => (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      
                      <Feather name="settings" style={{marginRight: 15, marginLeft: 30, color: 'white'}} size={22} onPress={() => navigation.navigate('Podešavanja')}/>
                    </View>
                ),
                headerLeft: () => (
                  <MaterialCommunityIcons name="logout" size={25} style={{color: 'white', marginLeft: 15}} onPress={() => this.props.deleteJWT()} />
                )
              })}
            />
            <Stack.Screen 
            name="Podešavanja" 
            component={Podesavanja}
            options={ ({ navigation }) => ({
                headerStyle: {backgroundColor: 'rgb(0, 132, 208)'},
                headerTintColor: 'white'
              })}
            />
            <Stack.Screen 
            name="Predmeti" 
            component={Predmeti}
            options={ ({ navigation, route }) => ({
                title: 'Uredi predmete',
                headerStyle: {backgroundColor: 'rgb(0, 132, 208)'},
                headerTintColor: 'white'
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
}

const styles = {
    container: {
      flex: 1,
      justifyContent: 'center'
    }
  };

export { MainComponent };