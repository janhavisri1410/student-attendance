import React, { Component } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, DatePickerIOS, TextInput, Alert } from 'react-native';
import {PCard, Loading, SubjectBtn} from '../../common';
import axios from 'axios';
import deviceStorage from '../../../services/deviceStorage';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { hide } from 'expo/build/launch/SplashScreen';

class UrediPredavanja extends Component {
  constructor(props){
    super(props);
    this.state = {
      jwt: '',
      loading: false,
      pickerVisibleD: false,
      pickerVisibleOd: false,
      pickerVisibleDo: false,
      lokacija: ''
    };
    this.prviDatum = null;
    this.intervalOd = null;
    this.intervalDo = null;
    this.sviDatumi = [];
    this.loadJWT = deviceStorage.loadJWT.bind(this);
    this.showDatePickerD = this.showDatePickerD.bind(this);
    this.showDatePickerOd = this.showDatePickerOd.bind(this);
    this.showDatePickerDo = this.showDatePickerDo.bind(this);
    this.hideDatePicker = this.hideDatePicker.bind(this);
    this.convertDay = this.convertDay.bind(this);
    this.convertMonth = this.convertMonth.bind(this);
    this.registrujPredavanje = this.registrujPredavanje.bind(this);
  }

  registrujPredavanje(){
    axios.patch("https://attendance-app997.herokuapp.com/api/activities/updateActivities", {activity: this.props.route.params.activity, date: this.sviDatumi, aptFrom: this.intervalOd, aptTo: this.intervalDo, location: this.state.lokacija})
    .then((response) => {
      Alert.alert('Uspeh!', 'Uspešno ste izmenili predavanja');
      this.setState({loading: false})
      this.props.navigation.navigate('SviPredmeti');
    }).catch((error) => {
      console.log(error);
    })
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
  }

  kreiraj12Predavanja(){
    var pom = new Date(this.prviDatum.getTime());
    this.sviDatumi = [];
    for (let i=0; i < 12; i++)
    {
      var day = pom.setTime(pom.getTime() + (7*i * 24 * 60 * 60 * 1000));
      var dayy = new Date(day);
      dayy.setHours(0);
      dayy.setMinutes(0);
      this.sviDatumi.push(dayy);
      // var day = new Date();
      // day.setDate(pom.getDate() + 7*i);
      // day.setHours(0);
      // day.setMinutes(0);
      // this.sviDatumi.push(day);
    }
    console.log(this.sviDatumi);
  }

  showDatePickerD(){
    this.setState({pickerVisibleD: true});
  }

  showDatePickerOd(){
    this.setState({pickerVisibleOd: true});
  }

  showDatePickerDo(){
    this.setState({pickerVisibleDo: true});
  }

  hideDatePicker(){
    this.setState({pickerVisibleD: false, pickerVisibleOd: false, pickerVisibleDo: false});
  }

  

  render() {

    const {lokacija} = this.state;

    const handleConfirm = (date) => {
      this.prviDatum = date;
      console.log(this.prviDatum);
      this.kreiraj12Predavanja();
      this.hideDatePicker();
    };

    const handleConfirmOd = (date) => {
      this.intervalOd = date;
      if(this.intervalOd > this.intervalDo)
      {
        this.intervalDo = null;
      }
      console.log(this.intervalOd);
      this.hideDatePicker();
    };

    const handleConfirmDo = (date) => {
      this.intervalDo = date;
      if(this.intervalOd > this.intervalDo)
      {
        this.intervalOd = null;
      }
      console.log(this.intervalDo);
      this.hideDatePicker();
    };

    return (
        <View style={styles.container}>
          <TouchableOpacity onPress={() => console.log(this.sviDatumi)}>
            <Text style={{fontSize: 19, marginTop: 20, marginLeft: 20, marginBottom: 7, color: '#009387'}}>Uredi predavanja </Text>
          </TouchableOpacity>
          <View style={{height: 1, width: '90%', backgroundColor: '#009387', alignSelf: 'center'}}/>
          <Text style={{marginTop: 20, fontSize: 17, marginLeft: 20, color: '#009387', fontWeight: 'bold'}}>Odaberite datum prvog predavanja</Text>
          {this.prviDatum != null ?
            <TouchableOpacity onPress={() => this.showDatePickerD()} style={{marginTop: 5}}>
              <View style={{width: '90%', alignSelf: 'center', alignContent: 'center', backgroundColor: 'lightgray', borderRadius: 7}}>
                <Text style={{fontSize: 17, padding: 10}}>{this.convertDay(this.prviDatum.getDay())}, {this.prviDatum.getDate()}. {this.convertMonth(this.prviDatum.getMonth())} {this.prviDatum.getFullYear()}.</Text>
              </View>
            </TouchableOpacity>
          :
          <TouchableOpacity onPress={() => this.showDatePickerD()} style={{marginTop: 5}}>
              <View style={{width: '90%', alignSelf: 'center', alignContent: 'center', backgroundColor: 'lightgray', borderRadius: 7}}>
                <Text style={{fontSize: 17, padding: 10, color: 'gray'}}>unesite datum prvog predavanja...</Text>
              </View>
            </TouchableOpacity>
          }

          <Text style={{marginTop: 30, fontSize: 17, marginLeft: 20, color: '#009387', fontWeight: 'bold'}}>Odaberite termin predavanja</Text>
          
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          {this.intervalOd != null ?
            <TouchableOpacity onPress={() => this.showDatePickerOd()} style={{marginTop: 5, width: '45%'}}>
              <View style={{width: '90%', alignSelf: 'center', alignContent: 'center', backgroundColor: 'lightgray', borderRadius: 7}}>
                <Text style={{fontSize: 17, padding: 10}}>{this.intervalOd.getHours()}:{this.intervalOd.getMinutes()}</Text>
              </View>
            </TouchableOpacity>
          :
          <TouchableOpacity onPress={() => this.showDatePickerOd()} style={{marginTop: 5, width: '45%'}}>
              <View style={{width: '90%', alignSelf: 'center', alignContent: 'center', backgroundColor: 'lightgray', borderRadius: 7}}>
                <Text style={{fontSize: 17, padding: 10, color: 'gray'}}>od...</Text>
              </View>
            </TouchableOpacity>
          }
          <Text style={{alignSelf: 'center', fontSize: 19}}>-</Text>
          {this.intervalDo != null ?
            <TouchableOpacity onPress={() => this.showDatePickerDo()} style={{marginTop: 5, width: '45%'}}>
              <View style={{width: '90%', alignSelf: 'center', alignContent: 'center', backgroundColor: 'lightgray', borderRadius: 7}}>
                <Text style={{fontSize: 17, padding: 10}}>{this.intervalDo.getHours()}:{this.intervalDo.getMinutes()}h</Text>
              </View>
            </TouchableOpacity>
          :
          <TouchableOpacity onPress={() => this.showDatePickerDo()} style={{marginTop: 5, width: '45%'}}>
              <View style={{width: '90%', alignSelf: 'center', alignContent: 'center', backgroundColor: 'lightgray', borderRadius: 7}}>
                <Text style={{fontSize: 17, padding: 10, color: 'gray'}}>do...</Text>
              </View>
            </TouchableOpacity>
          }
          </View>

          <Text style={{marginTop: 30, fontSize: 17, marginLeft: 20, color: '#009387', fontWeight: 'bold'}}>Odaberite lokaciju predavanja</Text>
          <TextInput 
                placeholder="unesite lokaciju..."
                style={{width: '90%', alignSelf: 'center', backgroundColor: 'lightgray', padding: 10, fontSize: 17, borderRadius: 7, marginTop: 5}}
                value={lokacija}
                onChangeText={lokacija => this.setState({lokacija})}
          />
          {this.state.loading?
            <View style={{marginTop: 100}}>
              <Loading size='large'/>
            </View>
            :
            <SubjectBtn onPress={() => {
              if(this.sviDatumi.length != 0 && this.intervalOd != null && this.intervalDo!=null && this.state.lokacija!='')
              {
                this.registrujPredavanje();
                this.setState({loading: true})
                this.props.route.params.listaj;
              }
              else
              {
                Alert.alert('Upozorenje!', 'Popunite sva polja!');
              }
            }}
               style={{marginTop: 100, borderWidth: 2, borderColor: '#009387', padding: 10, marginHorizontal: 20}}>Izmeni predavanja</SubjectBtn>
          }
          

          <View>
            <DateTimePickerModal
              isVisible={this.state.pickerVisibleD}
              mode="date"
              isDarkModeEnabled={false}
              onConfirm={handleConfirm}
              onCancel={() => this.hideDatePicker()}
            />
          </View>

          <View>
            <DateTimePickerModal
              isVisible={this.state.pickerVisibleOd}
              mode="time"
              isDarkModeEnabled={false}
              onConfirm={handleConfirmOd}
              onCancel={() => this.hideDatePicker()}
            />
          </View>

          <View>
            <DateTimePickerModal
              isVisible={this.state.pickerVisibleDo}
              mode="time"
              isDarkModeEnabled={false}
              onConfirm={handleConfirmDo}
              onCancel={() => this.hideDatePicker()}
            />
          </View>
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

export { UrediPredavanja };