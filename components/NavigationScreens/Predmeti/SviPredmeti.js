import React, { Component } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import {PCard, Loading} from '../../common';
import axios from 'axios';
import deviceStorage from '../../../services/deviceStorage';

import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

class SviPredmeti extends Component {
  constructor(props){
    super(props);
    this.state = {
      jwt: '',
      loading: true,
      account_type: '',
      upisaniPredmeti: [],
      isFetching: false
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

  onRefresh(){
      this.setState({isFetching: true,},() => {this.listajPredmete()});
  }
  
  listajPredmete(){
    axios.post(`https://attendance-app997.herokuapp.com/api/subjects/get-user-subjects/${this.state.jwt}`)
    .then((response) => {
      this.setState({upisaniPredmeti: response.data, loading: false, isFetching: false});
    })
    .catch((error) => {
      console.log(error);
    });
  }

  render() {
    return (
        <View style={styles.container}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 19, marginTop: 20, marginLeft: 20, marginBottom: 7, color: '#009387'}}>MOJI PREDMETI </Text>
            <Feather name='settings' style={{marginTop: 22, marginRight: 30}} size={22} onPress={() => this.props.navigation.navigate('UrediPredmete', {upisaniPredmeti: this.state.upisaniPredmeti, jwt: this.state.jwt})}/>
          </View>
          <View style={{height: 1, width: '90%', backgroundColor: '#009387', alignSelf: 'center'}}/>

          {this.state.loading?
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Loading size={'large'}/>
          </View>
          :
          <FlatList
          data={this.state.upisaniPredmeti}
          keyExtractor={(item) => item._id.toString()}
          showsHorizontalScrollIndicator={false}
          onRefresh={() => this.onRefresh()}
          refreshing={this.state.isFetching}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('OpenPredmet', {izabranPredmet: item, listaj: this.listajPredmete()})}>
              <PCard
                style={{
                    padding: 10,
                    borderWidth: 1,
                    borderColor: '#009387',
                    backgroundColor: 'rgb(217, 217, 217)',
                    flexDirection: 'row',      
                }}
              >
                <Text style={[styles.cardText, {flex: 3, marginLeft: 10, color: '#009387', fontSize: 17}]}>{item.name}</Text>
              </PCard>
            </TouchableOpacity>
          )}
          style={{ width: '100%' }}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', paddingTop: 20 }}
        />
        }
          
        </View>
      );
    }
}

const styles = {
    container: {
      flex: 1
    }
  };

export { SviPredmeti };