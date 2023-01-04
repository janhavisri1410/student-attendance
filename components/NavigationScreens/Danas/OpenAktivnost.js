import React, { Component } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import {PCard, Loading} from '../../common';
import axios from 'axios';
import deviceStorage from '../../../services/deviceStorage';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

class OpenAktivnost extends Component {
  constructor(props){
    super(props);
    this.state = {
      jwt: '',
      loading: true,
      account_type: '',
      upisaniPredmeti: [],
      isFetching: false,
      userAtt: [],
      studentAtt: []
    };
    console.log(this.props.route.params.activity.attendees);
    this.getPrisutne = this.getPrisutne.bind(this);
    this.getPrisutne();
  }

  getPrisutne(){
    axios.post("https://attendance-app997.herokuapp.com/api/activities/getAttendees", {activity: this.props.route.params.activity})
    .then((response) => {
      this.prisutniUserIDs = [];
      this.setState({loading: false, isFetching: false, userAtt: response.data[0], studentAtt: response.data[1]});
    })
    .catch((error) => {
      console.log(error);
    });
  };

  izbrisiStudenta(userID){
    axios.post("https://attendance-app997.herokuapp.com/api/activities/izbrisiStudenta", {userID: userID, activityID: this.props.route.params.activity._id})
    .then((response) => {
      Alert.alert('Uspeh!', 'Uspešno ste izbrisali studenta!');
      this.onRefresh();
    })
    .catch((error) => {
      console.log(error);
    });
  };

  nadjiIndex(user){
    for (let i = 0; i < this.state.studentAtt.length; i++)
    {
      if(this.state.studentAtt[i].user == user._id)
      {
        return this.state.studentAtt[i].indexNr;
      }
    }
  }

  onRefresh(){
      this.setState({isFetching: true,},() => {this.getPrisutne()});
  }

  renderHeader = () => {
    //View to set in Header
    return (
      <View style={[styles.header_footer_style, {borderWidth: 1}]}>
        <View style={{width: '10%', justifyContent: 'center', borderRightWidth: 1, marginRight: 5}}>
          <Text style={[styles.textStyle, {width: '100%', marginLeft: 10}]}> rBr </Text>
        </View>
        
        <View style={{width: '45%', justifyContent: 'center', borderRightWidth: 1, marginRight: 5}}>
          <Text style={[styles.textStyle, {width: '100%', marginLeft: 10}]}>Ime i prezime</Text>
        </View>
  
        <View style={{width: '30%', justifyContent: 'center', borderRightWidth: 1, marginRight: 5}}>
          <Text style={[styles.textStyle, {width: '100%', marginLeft: 10}]}>br. Indexa</Text>
        </View>

        <View style={{width: '15%', justifyContent: 'center'}}>
          <Text style={[styles.textStyle, {width: '100%', marginLeft: 13}]}>
          </Text>
        </View>
      </View>
    );
  };
  

  render() {
    return (
        <View style={styles.container}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 16, fontWeight: 'bold', marginTop: 20, marginLeft: 10, marginBottom: 7, color: '#009387'}}>{this.props.route.params.activity.type} - {this.props.route.params.imePredmeta}</Text>
                <Entypo style={{marginTop: 15, marginRight: 20}} name="plus" size={30} color="#009387" onPress={() => this.props.navigation.navigate('DodajStudenta', {subjID: this.props.route.params.predmet._id, activity: this.props.route.params.activity, users: this.state.userAtt})}/>
          </View>
          <View style={{height: 1, width: '95%', backgroundColor: '#009387', alignSelf: 'center', marginBottom: 20}}/>
          <FlatList
          data={this.state.userAtt}
          marginBottom={20}
          ListHeaderComponent={this.renderHeader}
          keyExtractor={(item) => item._id.toString()}
          showsHorizontalScrollIndicator={false}
          onRefresh={() => this.onRefresh()}
          refreshing={this.state.isFetching}
          renderItem={({ item, index }) => (
            <View style={[styles.hs, {borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1}]}>
              <View style={{width: '10%', justifyContent: 'center', borderRightWidth: 1, marginRight: 5}}>
                <Text style={[styles.textStyle, {width: '100%', textAlign: 'center'}]}>{index+1}</Text>
              </View>
              
              <View style={{width: '45%', justifyContent: 'center', borderRightWidth: 1, marginRight: 5}}>
                <Text style={[styles.textStyle, {width: '100%', marginLeft: 10}]}>{item.name} {item.lastName}</Text>
              </View>

              <View style={{width: '30%', justifyContent: 'center', borderRightWidth: 1, marginRight: 5}}>
                <Text style={[styles.textStyle, {width: '100%', marginLeft: 10}]}>{this.nadjiIndex(item)}</Text>
              </View>

              <View style={{width: '15%', justifyContent: 'center', margin: 9}}>
                <TouchableOpacity onPress={() => {
                  Alert.alert(
                    'Brisanje',
                    'Da li ste sigurni da želite da izbrišete studenta ' + item.name + ' ' + item.lastName + ' iz liste prisutnih?',
                    [
                      {
                        text: 'Izbriši',
                        onPress: () => this.izbrisiStudenta(item._id)
                      },
                      {
                        text: 'Otkaži',
                        onPress: () => console.log('Otkazano'),
                        style: 'cancel'
                      }
                    ],
                    { cancelable: false }
                  );
                }}>
                  <MaterialIcons name="delete" size={20} color="red"/>
                </TouchableOpacity>
              </View>
            </View>
          )}
          style={{ width: '100%' }}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }}
        />
            
        </View>
      );
    }
}

const styles = {
    container: {
      flex: 1,
      justifyContent: 'flex-start'
    },
    hs: {
      marginLeft: 10,
      flexDirection: 'row',
      marginRight: 10,
      marginBottom: 0,
      height: 45,
      backgroundColor: 'white',
    },
    textStyle: {
      color: '#000',
      fontSize: 15,
      alignSelf: 'center',
    },
    header_footer_style: {
      marginLeft: 10,
      flexDirection: 'row',
      marginRight: 10,
      marginBottom: 0,
      height: 45,
      backgroundColor: 'rgb(216, 216, 216)',
      borderColor: 'black'
    },
  };

export { OpenAktivnost };