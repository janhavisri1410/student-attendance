import React, { Component, Fragment } from 'react';
import { View, Text, Button, Platform, StyleSheet, TextInput, Switch, SafeAreaView, KeyboardAvoidingView, Alert } from 'react-native';
import { CustomInput, TextLink, CustomButton, Loading } from './common';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';
import axios from 'axios';
import deviceStorage from '../services/deviceStorage';

class AdditionalReg extends Component {
  constructor(props){
    super(props);
    this.state = {
      department: '',
      profile: '',
      yos: '',
      index: '',
      loading: false,
      studReg: false
    };
    this.registerStud = this.registerStud.bind(this);
  }

  registerStud() {
    const { department, profile, yos, index } = this.state;

    this.setState({ error: '', loading: true });

    axios.post("https://attendance-app997.herokuapp.com/api/user/register",{
        type: this.props.Rtype,
        verified: false,
        name: this.props.Rname,
        lastName: this.props.RlastName,
        username: this.props.Rusername,
        password: this.props.Rpassword,
        jmbg: this.props.Rjmbg,
        email: this.props.Remail,
        department: department,
        profile: profile,
        yearOfStudy: yos,
        indexNr: index
    },)
    .then((response) => {
      Alert.alert('Registracija uspešna!', 'Da bi se prijavili molimo Vas potvrdite svoju E-Mail adresu')
      this.props.authSwitch();
    })
    .catch((error) => {
      this.setState({loading: false});
      Alert.alert('Greška!', error.response.data);
    });
  }

  render() {
    const { department, profile, yos, index, loading, tipReg } = this.state;
    const setState = state => this.setState(state); // dopusta nam da setujemo stateove
    const departmani = [
      {label: 'PRAVNE NAUKE', value: 'Pravne'},
      {label: 'EKONOMSKE NAUKE', value: 'Ekonomske'},
      {label: 'FILOLOŠKE NAUKE', value: 'Filološke'},
      {label: 'FILOZOFSKE NAUKE', value: 'Filozofske'},
      {label: 'MATEMATIČKE NAUKE', value: 'Matematičke'},
      {label: 'TEHNIČKE NAUKE', value: 'Tehničke'},
      {label: 'HEMIJSKO-TEHNOLOŠKE NAUKE', value: 'Hemijsko-Tehnološke'},
      {label: 'BIOMEDICINSKE NAUKE', value: 'Biomedicinske'},
      {label: 'UMETNOST', value: 'Umetničke'},
      {label: 'BIOTEHNIČKE NAUKE U SJENICI', value: 'Biotehničke'}
    ];
    const ph = [
      {
        label: 'Odaberi departman',
        value: '',
        color: '#000',
      },
      {
        label: 'Odaberi smer',
        value: '',
        color: '#000'
      },
      {
        label: 'Odaberi godinu',
        value: '',
        color: '#000'
      }
    ];
    var smerovi = [];
    smerovi[''] = [
      {label: 'Prva odabrati departman', value: 'null'}
    ];
    smerovi['Pravne'] = [
      {label: 'Pravo', value: 'Pravo'}
    ];
    smerovi['Ekonomske'] = [
      {label: 'Ekonomija', value: 'Ekonomija'},
      {label: 'Poslovna informatika', value: 'Poslovna informatika'}
    ];
    smerovi['Filološke'] = [
      {label: 'Srpska književnost i jezik', value: 'Srpska književnost i jezik'},
      {label: 'Engleski jezik i književnost', value: 'Engleski jezik i književnost'}
    ];
    smerovi['Filozofske'] = [
      {label: 'Psihologija', value: 'Psihologija'},
      {label: 'Vaspitač u predškolskim ustanovama', value: 'Vaspitač u predškolskim ustanovama'}
    ];
    smerovi['Matematičke'] = [
      {label: 'Matematika', value: 'Matematika'},
      {label: 'Matematika i fizika', value: 'Matematika i fizika'},
      {label: 'Informatika i matematika', value: 'Informatika i matematika'},
      {label: 'Informatika i fizika', value: 'Informatika i fizika'}
    ];
    smerovi['Tehničke'] = [
      {label: 'Arhitektura', value: 'Arhitektura'},
      {label: 'Računarska tehnika', value: 'Računarska tehnika'},
      {label: 'Građevinarstvo', value: 'Građevinarstvo'},
      {label: 'Audio i video tehnologije', value: 'Audio i video tehnologije'},
      {label: 'Softversko inženjerstvo', value: 'Softversko inženjerstvo'}
    ];
    smerovi['Hemijsko-Tehnološke'] = [
      {label: 'Hemija', value: 'Hemija'},
      {label: 'Poljoprivredna proizvodnja', value: 'Poljoprivredna proizvodnja'}
    ];
    smerovi['Biomedicinske'] = [
      {label: 'Biologija', value: 'Biologija'},
      {label: 'Rehabilitacija', value: 'Rehabilitacija'},
      {label: 'Sport i fizičko vaspitanje', value: 'Sport i fizičko vaspitanje'},

    ];
    smerovi['Umetničke'] = [
      {label: 'Likovna umetnost', value: 'Likovna umetnost'}
    ];
    smerovi['Biotehničke'] = [
      {label: 'Prehrambena tehnologija', value: 'Prehrambena tehnologija'},
      {label: 'Agronomija', value: 'Agronomija'}
    ];
    const godine = [
      {label: '1. godina', value: '1. godina'},
      {label: '2. godina', value: '2. godina'},
      {label: '3. godina', value: '3. godina'},
      {label: '4. godina', value: '4. godina'}
    ];
    

    return (

      <Fragment>
        <View style={styles.container}>
        <SafeAreaView/>
          {/* ##### HEADER ##### */}
          <View style={styles.header}>
            <View style={{justifyContent: 'flex-end'}}>
              <Text style={styles.text_header}>Registracija {this.props.Rtype}a</Text>
            </View>
          </View>

          {/* ##### FOOTER ##### */}
          <View style={styles.footer}>
            
            {/* ##### U ZAVISNOSTI OD TOGA DA LI JE STUDENT ILI PROFESOR VRACAJU SE RAZLICITE STVARI ##### */}
              {this.props.Rtype == 'Profesor' ?
                
                /* ##### PROFESOR VIEW ##### */
                <Fragment>
                  
                </Fragment>
              :
                /* ##### STUDENT VIEW ##### */
                <Fragment>

                  {/* ##### DEPARTMAN ##### */}
                  <Text style={[styles.text_footer, {
                    marginBottom: -15,
                    marginTop: 10
                  }]}>Departman</Text>
                  <View style={({marginTop: 20})}>
                    <RNPickerSelect
                      value={department}
                      onValueChange={(department) => {
                        this.setState({department}
                        )}}
                      items={departmani}
                      placeholder={ph[0]}
                      style={pickerSelectStyles}
                    />
                  </View>

                  {/* ##### SMER ##### */}
                  <Text style={[styles.text_footer, {
                    marginBottom: -15,
                    marginTop: 15
                  }]}>Smer</Text>
                  <View style={({marginTop: 20})}>
                    <RNPickerSelect
                      value={profile}
                      onValueChange={(profile) => {
                        this.setState({profile})
                      }}
                      items={smerovi[(this.state.department)]}
                      placeholder={ph[1]}
                      style={pickerSelectStyles}
                    />
                  </View>

                  {/* ##### GODINA STUDIJA ##### */}
                  <Text style={[styles.text_footer, {
                    marginTop: 40
                  }]}>Godina studija</Text>
                  <View style={({marginTop: 20})}>
                    <RNPickerSelect
                      value={yos}
                      onValueChange={(yos) => {
                        this.setState({yos})
                      }}
                      items={godine}
                      placeholder={ph[2]}
                      style={pickerSelectStyles}
                    />
                    {/**
                    <TextInput 
                      placeholder="Godina studija"
                      style={styles.textInput}
                      autoCapitalize="none"
                      value={yos}
                      onChangeText={yos => this.setState({yos})}
                    />
                     */}
                    
                  </View>

                  {/* ##### INDEX ##### */}
                  <Text style={[styles.text_footer, {
                    marginTop: 15
                  }]}>Index</Text>
                  <View style={styles.action}>
                    <FontAwesome 
                      name="id-card-o"
                      color="#05375a"
                      size={20}
                    />
                    <TextInput 
                      placeholder="Index"
                      style={styles.textInput}
                      autoCapitalize="none"
                      value={index}
                      onChangeText={index => this.setState({index})}
                    />
                  </View>
                </Fragment>
              }

            {/* ##### BTN REGISTRUJ SE I OTKAZI ##### */}
            {this.state.loading?
              <View style={{alignSelf: 'center', justifyContent: 'center'}}>
                <Loading size={'large'}/>
              </View>
              :
              <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 20}}>
              <CustomButton //onPress={this.registerStud}
              onPress={() => {
                if(index!='' && yos!='' && profile!='' && department!='')
                this.registerStud();
                else
                Alert.alert('Greška!', 'Molimo Vas popunite sva polja!');
              }}
              >          Registruj se          </CustomButton>
              <CustomButton
              onPress={() => {
                this.props.cancelReg();
              }}
              >Otkaži</CustomButton>
            </View>
            }
            
          </View>
        </View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%', 
    backgroundColor: '#009387'
  },
  header: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingBottom: 30
  },
  footer: {
      flex: 7,
      backgroundColor: '#fff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingHorizontal: 20,
      paddingVertical: 15
  },
  text_header: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 30
  },
  text_footer: {
      color: '#05375a',
      fontSize: 18,
      marginBottom: -5
  },
  action: {
      flexDirection: 'row',
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#f2f2f2',
      paddingBottom: 5
  },
  actionError: {
      flexDirection: 'row',
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#FF0000',
      paddingBottom: 5
  },
  textInput: {
      flex: 1,
      paddingLeft: 10,
      color: '#05375a',
      fontSize: 19
  },
  errorMsg: {
      color: '#FF0000',
      fontSize: 14,
  },
  button: {
      alignItems: 'center',
      marginTop: 50
  },
  signIn: {
      width: '100%',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10
  },
  textSign: {
      fontSize: 18,
      fontWeight: 'bold'
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderColor: 'gray',
    borderRadius: 7,
    backgroundColor: '#f0f0f0',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export { AdditionalReg };