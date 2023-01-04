import React, { Component } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import deviceStorage from '../../services/deviceStorage';
import axios from 'axios';
import { PrijaviMeBtn, Loading } from '../common';
import Entypo from 'react-native-vector-icons/Entypo';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

class Prisustvo extends Component {
  constructor(props){
    super(props);
    this.state = {
      jwt: '',
      loading: false,
      account_type: '',
      activities: [],
      isFetching: false,
      upisaniPredmeti: [],
      prijavljen: false,
      studentID: ''
    };
    this.loadJWT = deviceStorage.loadJWT.bind(this);
    this.loadJWT();
    this.count = 0;
    this.danasnjidan = new Date();
    this.trenutneAktivnosti = [];
    this.getActivities = this.getActivities.bind(this);
    this.listajPredmete = this.listajPredmete.bind(this);
    this.upisiMe = this.upisiMe.bind(this);
  }

  componentDidUpdate(){
    if(this.state.upisaniPredmeti[0] == null && this.trenutneAktivnosti.length == 0)
    {
      if(this.count < 2)
      {
        this.listajPredmete();
        this.getActivities();
        this.count++;
      }
      
    }
  }

  listajPredmete(){
    axios.post(`https://attendance-app997.herokuapp.com/api/subjects/get-user-subjects/${this.state.jwt}`)
    .then((response) => {
      this.setState({upisaniPredmeti: response.data});
      this.onRefresh();
    })
    .catch((error) => {
      console.log(error);
    });
  };

  getActivities(){
    axios.post(`https://attendance-app997.herokuapp.com/api/activities/getStudentActivities/${this.state.jwt}`)
    .then((response) => {
      this.setState({activities: response.data[0], studentID: response.data[1], loading: false, isFetching: false});
      this.trenutneAktivnosti = [];
      for(let aktivnost of response.data[0])
      {
        var sada = new Date();

        var danP = new Date(Date.parse(aktivnost.date));
        var dan = danP.getDay();
        var danUM = danP.getDate();
        var mesec = danP.getMonth();
        var godina = danP.getFullYear();
        if(sada.getDay() == dan && sada.getDate() == danUM && sada.getMonth() == mesec && sada.getFullYear() == godina)
        {

          if((new Date(Date.parse(aktivnost.aptFrom)).getHours()*60 + new Date(Date.parse(aktivnost.aptFrom)).getMinutes()) <= sada.getHours()*60 + sada.getMinutes())
          {
            if((new Date(Date.parse(aktivnost.aptTo)).getHours()*60 + new Date(Date.parse(aktivnost.aptTo)).getMinutes()) >= sada.getHours()*60 + sada.getMinutes())
            {
              this.trenutneAktivnosti.push(aktivnost);
            }
          }
          // if(Date.parse(aktivnost.aptFrom) < sada.getTime() && Date.parse(aktivnost.aptTo) > sada.getTime())
          // {
          //   this.trenutneAktivnosti.push(aktivnost);
            
          // }
        }
      }
    }).catch((error) => {
      console.log(error);
    })
  }

  refreshActivities(){
    axios.post(`https://attendance-app997.herokuapp.com/api/activities/getStudentActivities/${this.state.jwt}`)
    .then((response) => {
      this.setState({activities: response.data[0], studentID: response.data[1], isFetching: false});
      this.trenutneAktivnosti = [];
      for(let aktivnost of response.data[0])
      {
        var sada = new Date();

        var danP = new Date(Date.parse(aktivnost.date));
        var dan = danP.getDay();
        var danUM = danP.getDate();
        var mesec = danP.getMonth();
        var godina = danP.getFullYear();
        if(sada.getDay() == dan && sada.getDate() == danUM && sada.getMonth() == mesec && sada.getFullYear() == godina)
        {
          if(Date.parse(aktivnost.aptFrom) < sada.getTime() && Date.parse(aktivnost.aptTo) > sada.getTime())
          {
            this.trenutneAktivnosti.push(aktivnost);
            
          }
        }
      }
    }).catch((error) => {
      console.log(error);
    })
  }

  upisiMe(act){
    axios.post(`https://attendance-app997.herokuapp.com/api/activities/signMe/${this.state.jwt}`, {activity: act})
    .then((response) => {
      this.setState({prijavljen: false});
      Alert.alert('Uspeh!', 'Uspešno ste prijavili prisustvo!');
      //this.getActivities();
    }).catch((error) => {
      console.log(error);
    })
  }

  onRefresh(){
    this.setState({isFetching: true},() => {this.getActivities();});
  }

  afGH(datum){
    var from = new Date(Date.parse(datum.aptFrom));
    var s = from.getHours();
    if (from.getHours() < 10)
      s = '0'+from.getHours();
    return s;
  }
  
  afGM(datum){
    var from = new Date(Date.parse(datum.aptFrom));
    var s = from.getMinutes();
    if (from.getMinutes() < 10)
      return '0'+from.getMinutes();
    return s; 
  }
  
  atGH(datum){
    var from = new Date(Date.parse(datum.aptTo));
    var s = from.getHours();
    if (from.getHours() < 10)
      s = '0'+from.getHours();
    return s;
  }
  
  atGM(datum){
    var from = new Date(Date.parse(datum.aptTo));
    var s = from.getMinutes();
    if (from.getMinutes() < 10)
      return '0'+from.getMinutes();
    return s;
  }
  
  _listEmptyComponent = () => {
    return (
      <View>
      <Text style={{textAlign: 'center', fontSize: 19}}>Nema trenutnih aktivnosti</Text>
    </View>
    )
  }

  vratiImePredmeta(idpredmeta){
    for (let predmet of this.state.upisaniPredmeti)
    {
      if (predmet._id == idpredmeta)
        return predmet.name;
    }
  }

  daliSamPrijavljen(activity){
    if(activity.attendees.includes(this.state.studentID) || activity.banned.includes(this.state.studentID))
    {
      return false;
    }
      
    else
      return true;
  }

  _renderItem = ({item, index}) => {
    return (
        <View>
          <View style={{backgroundColor: 'rgb(0, 132, 208)', width: '90%', alignSelf: 'center', marginTop: 10, borderTopEndRadius: 5, borderTopStartRadius: 5, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between'}}>
            <Text style={{color: 'white', fontSize: 17, padding: 10}}>{this.vratiImePredmeta(item.subject)}</Text>
            <Text style={{color: 'white', fontSize: 15, padding: 10}}>{this.afGH(item)}:{this.afGM(item)} - {this.atGH(item)}:{this.atGM(item)}h</Text>
          </View>
          <View style={{backgroundColor: 'white', width: '90%', alignSelf: 'center', borderWidth: 1, borderColor: 'rgb(0, 132, 208)', borderBottomEndRadius: 5, borderBottomStartRadius: 5}}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <View style={{justifyContent: 'flex-start'}}>
            <Text style={{fontSize: 15, paddingLeft: 10, marginTop: 0, color: 'rgb(0, 132, 208)', alignSelf: 'flex-start', fontWeight: 'bold'}}>{item.type}</Text>
            <Text style={{fontSize: 15, paddingLeft: 10, paddingTop: 10, color: 'rgb(0, 132, 208)', alignSelf: 'flex-start'}}>Kabinet br: {item.location}</Text>
            </View>
              
              <View style={{marginTop: 20}}>
              {this.daliSamPrijavljen(item)?

                this.state.loading?
                  <View style={{marginRight: 20}}>
                    <Loading size='large'/>
                  </View>
                :

                  <PrijaviMeBtn onPress={() => {
                  this.setState({loading: true});
                  this.upisiMe(item._id);
                  this.refreshActivities();
                  this.onRefresh();
                  
                  
                  }}>Prijavi me</PrijaviMeBtn>
              :

                <View style={{width: 50, backgroundColor: 'rgb(0, 132, 208)', alignItems: 'center', padding: 10, marginRight: 15, marginBottom: 10, borderRadius: 10}}>
                  <Entypo name="check" size={20} color={'white'}/>
                </View>
              }
              </View>
              
            </View>
          </View>
        </View>
    )
  }

  convertDay(num){
    switch(num){
      case 0:
        return 'Nedelja';
        break;
      case 1:
        return 'Ponedeljak';
        break;
      case 2:
        return 'Utorak';
        break;
      case 3:
        return 'Sreda';
        break;
      case 4:
        return 'Četvrtak';
        break;
      case 5:
        return 'Petak';
        break;
      case 6:
        return 'Subota';
        break;
    }
  };
  
  convertMonth(num){
    switch(num){
      case 0:
        return 'Januar';
        break;
      case 1:
        return 'Februar';
        break;
      case 2:
        return 'Mart';
        break;
      case 3:
        return 'April';
        break;
      case 4:
        return 'Maj';
        break;
      case 5:
        return 'Juni';
        break;
      case 6:
        return 'Juli';
        break;
      case 7:
        return 'Avgust';
        break;
      case 8:
        return 'Septembar';
        break;
      case 9:
        return 'Oktobar';
        break;
      case 10:
        return 'Novembar';
        break;
      case 11:
        return 'Decembar';
        break;
    }
  };

  drawDate(datum){
    var from = new Date(Date.parse(datum));
    var dan = from.getDay();
    var danUM = from.getDate();
    var mesec = from.getMonth();
    var godina = from.getFullYear();
  
    return (this.convertDay(dan) + ', ' + danUM + '. ' + this.convertMonth(mesec) + '. ' + godina + '.');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{margin: 22, fontSize: 19, color: 'rgb(0, 132, 208)', fontWeight: 'bold'}}>{this.drawDate(this.danasnjidan)}</Text>
        <View style={styles.container}>
        {false?
          <View style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
            <Loading size={'large'} />
          </View>
          :
          <FlatList
            data={this.trenutneAktivnosti}
            keyExtractor={(item) => item._id.toString()}
            showsHorizontalScrollIndicator={false}
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.isFetching}
            ListEmptyComponent={this._listEmptyComponent}
            renderItem={ this._renderItem}
            style={{ width: '100%' }}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }}
          />
      }
        
      </View>
      </View>
      
      );
      
    }
}

const styles = {
    container: {
      flex: 1,
      justifyContent: 'center'
    }
  };

export { Prisustvo };