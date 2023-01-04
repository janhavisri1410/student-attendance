import React, { Component } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { PCard, Loading } from '../common';
import axios from 'axios';
import deviceStorage from '../../services/deviceStorage';

import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

class Podesavanja extends Component {
  constructor(props){
    super(props);
    this.state = {
      jwt: '',
      loading: true,
      account_type: '',
      upisaniPredmeti: []
    };
    this.loadJWT = deviceStorage.loadJWT.bind(this);
    this.listajPredmete = this.listajPredmete.bind(this);
    this.loadJWT();
  }

  componentDidUpdate(){
    if(this.state.upisaniPredmeti[0] == null)
    {
      this.listajPredmete();
    }
  }
  
  listajPredmete(){
    axios.post(`https://attendance-app997.herokuapp.com/api/subjects/get-user-subjects/${this.state.jwt}`)
    .then((response) => {
      this.setState({upisaniPredmeti: response.data, loading: false});
    })
    .catch((error) => {
      console.log(error);
    });
  }

  render() {
    return (
        <View style={styles.container}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 19, marginTop: 20, marginLeft: 20, marginBottom: 7, color: 'rgb(0, 132, 208)'}}>Predmeti na koje sam upisan </Text>
            <Feather name='settings' style={{marginTop: 22, marginRight: 30}} size={22} onPress={() => this.props.navigation.navigate('Predmeti', {upisaniPredmeti: this.state.upisaniPredmeti, jwt: this.state.jwt})}/>
          </View>
          <View style={{height: 1, width: '90%', backgroundColor: 'rgb(0, 132, 208)', alignSelf: 'center'}}/>

          {this.state.loading?
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Loading size={'large'}/>
          </View>
          :
          <FlatList
          data={this.state.upisaniPredmeti}
          keyExtractor={(item) => item._id.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
              <PCard
                style={
                  true
                    ? {
                        padding: 10,
                        borderWidth: 1,
                        borderColor: 'rgb(120, 199, 245)',
                        backgroundColor: 'rgb(217, 217, 217)',
                        flexDirection: 'row',
                      }
                    : {
                        padding: 10,
                        borderRadius: 15,
                        borderColor: '#009387',
                        backgroundColor: 'white',
                        flexDirection: 'row',
                      }
                }
              >
                <Text style={
                  true?[styles.cardText, {flex: 3, marginLeft: 10, color: 'rgb(0, 132, 208)', fontSize: 17}]
                  :[styles.cardText, {flex: 3, marginLeft: 10, color: '#009387'}]}>{item.name}</Text>
                <FontAwesome 
                      name="balance-scale"
                      color="rgb(0, 132, 208)"
                      size={19}
                    />
                <Text style={{fontSize: 15, color: 'rgb(0, 132, 208)', marginLeft: 10, fontWeight: 'bold'}}></Text>
              </PCard>
          )}
          style={{ width: '100%' }}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        />
        }
          
        </View>
      );
    }
}

const styles = {
    container: {
      flex: 1,
      justifyContent: 'flex-start'
    }
  };

export { Podesavanja };