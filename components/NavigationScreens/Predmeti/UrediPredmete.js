import React, { Component } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { PCard, SubjectBtn } from '../../common';
import axios from 'axios';
import deviceStorage from '../../../services/deviceStorage';
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';

import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


class UrediPredmete extends Component {
  constructor(props){
    super(props);
    this.state = {
      jwt: '',
      loading: true,
      account_type: '',
      sviPredmeti: [],
      izabranaGod: '',
      department: '',
      profile: ''
    };
    this.upisaniPredmeti = [];
    this.izabraniPredmeti = [];
    this.loadJWT = deviceStorage.loadJWT.bind(this);
    this.pokupiPredmete = this.pokupiPredmete.bind(this);
    this.urediPredmete = this.urediPredmete.bind(this);
    this.upisiMe = this.upisiMe.bind(this);
    this.loadJWT();
    this.initPredmete();
    //this.pokupiPredmete('4. godina', '4');
  }

  /* Kako da izvedem ovo za brisanje i dodavanje novih predmeta?
  Prvo sacuvam sve predmete na koje je vec upisan. Za njih cu kasnije da pozovem funkciju koja ce da ispise studenta
  sa svih predmeta na kojima je bio upisan. Tj ispraznicu njegov subjects niz. Kada to zavrsim iz niza upisaniPredmeti 
  trazim jedan po jedan predmet i popam userID.

  Posle kad ima clean slate posaljem sve koje je izabrao tj izabraniPredmeti i upisem ih u student.subjects a posle za 
  svaki subject iz izabraniPredmeti trazim ga i pusham userID. Tjt.

    Kako to da odradim?
  Pri inicijalizaciji on predmete na kojima je vec upisan ce da smesti u niz upisaniPredmet. Takodje on ce te predmete 
  da smesti i u niz izabraniPredmeti, jer kad mu se otvori ono da stiklira i destiklira oni ce mu vec bit stiklirani.
  Taj niz izabraniPredmeti ce da se menja kako on stiklira/destiklira kao sto sam uradio u InitStudent.js
  
  */

 pokupiPredmete(godina, btn){
  axios.post("https://attendance-app997.herokuapp.com/api/subjects/get-specific-subjects", {department: this.state.department, profile: this.state.profile, yearOfStudy: godina})
    .then((response) => {
      this.setState({sviPredmeti: response.data, izabranaGod: btn})
    }).catch((error) => {
      console.log(error);
    })
}

  initPredmete(){
    for(let predmet of this.props.route.params.upisaniPredmeti)
    {
        this.upisaniPredmeti.push(predmet._id);
        this.izabraniPredmeti.push(predmet._id);
    }
  }

  upisiMe(){
    axios.patch(`https://attendance-app997.herokuapp.com/api/users/professors/dodajPredmete/${this.props.route.params.jwt}`, {subjects: this.izabraniPredmeti})
      .then((response) => {
        console.log('Student uspesno upisan na sve predmete!');
      }).catch((error) => {
        console.log(error);
      })
  }

  // funkcija koja ce prvo da obrise sve postojece predmete, a zatim poziva funkciju koja ce da upise na sve izabrane
  urediPredmete(){
    axios.patch(`https://attendance-app997.herokuapp.com/api/users/professors/ukloni-sve/${this.props.route.params.jwt}`,
    {subjects: this.upisaniPredmeti})
        .then((response) => {
            console.log('uspesno obrisao studenta sa svija');
            this.upisiMe();
            
        }).catch((error) => {
            console.log(error);
        })
  }

  onPressHandler(id) {
    let renderData = [...this.state.sviPredmeti];
    for (let data of renderData) {
      if (data._id == id) {
        data.selected = data.selected == null ? true : !data.selected;
        // ako je izabran da se ubaci u niz selectedsubjects,
        //ako nije onda da se proveri da li je u tom nizu i da se izbaci
        if (!this.izabraniPredmeti.includes(data._id)) {
          this.izabraniPredmeti.push(data._id);
        } else {
          this.izabraniPredmeti = this.izabraniPredmeti.filter(
            (item) => item != data._id
          );
        }
        break;
      }
    }
    this.setState({ predmeti: renderData });
    console.log(this.izabraniPredmeti);
  }

  render() {
    const { department, profile } = this.state;
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
      }
    ];
    var smerovi = [];
    smerovi[''] = [
      {label: 'Prvo odabrati departman', value: 'null'}
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
    return (
        <View style={styles.container}>

        {/* ##### DEPARTMAN ##### */}
        <View style={({marginTop: 20, width: '95%'})}>
            <RNPickerSelect
              value={department}
              onValueChange={(department) => {
                this.setState({department, izabranaGod: '', predmeti: []}
                )}}
              items={departmani}
              placeholder={ph[0]}
              style={pickerSelectStyles}
            />
          </View>
          <View style={({marginTop: 10, width: '95%'})}>
            <RNPickerSelect
              value={profile}
              onValueChange={(profile) => {
                this.setState({profile, izabranaGod: '', predmeti: []})
              }}
              items={smerovi[(this.state.department)]}
              placeholder={ph[1]}
              style={pickerSelectStyles}
            />
          </View>

          <View style={{ flexDirection: 'row'}}>
          <SubjectBtn
            style={
                this.state.izabranaGod == '1'
                    ? [styles.button, {
                        minHeight: 40,
                        justifyContent: 'center',
                        backgroundColor: '#009387',
                        marginLeft: 10
                        
                    }]
                    : [styles.button, {
                        minHeight: 40,
                        justifyContent: 'center',
                        backgroundColor: 'white',
                        marginLeft: 10
                        
                    }]
                }
            onPress={() => {this.pokupiPredmete('1. godina', '1')}}
          >
            <Text style={this.state.izabranaGod == '1' ? {color: 'white'}:{color: '#009387'}}>I god.</Text>
          </SubjectBtn>
          <SubjectBtn
            style={
                this.state.izabranaGod == '2'
                    ? [styles.button, {
                        minHeight: 40,
                        justifyContent: 'center',
                        backgroundColor: '#009387'
                        
                    }]
                    : [styles.button, {
                        minHeight: 40,
                        justifyContent: 'center',
                        backgroundColor: 'white'
                        
                    }]
                }
            onPress={() => {this.pokupiPredmete('2. godina', '2')}}
          >
            <Text style={this.state.izabranaGod == '2' ? {color: 'white'}:{color: '#009387'}}>II god.</Text>
          </SubjectBtn>
          <SubjectBtn
            style={
                this.state.izabranaGod == '3'
                    ? [styles.button, {
                        minHeight: 40,
                        justifyContent: 'center',
                        backgroundColor: '#009387'
                        
                    }]
                    : [styles.button, {
                        minHeight: 40,
                        justifyContent: 'center',
                        backgroundColor: 'white'
                        
                    }]
                }
            onPress={() => {this.pokupiPredmete('3. godina', '3')}}
          >
            <Text style={this.state.izabranaGod == '3' ? {color: 'white'}:{color: '#009387'}}>III god.</Text>
          </SubjectBtn>
          <SubjectBtn
            style={
                this.state.izabranaGod == '4'
                    ? [styles.button, {
                        minHeight: 40,
                        justifyContent: 'center',
                        backgroundColor: '#009387',
                        borderRightWidth: 0,
                        marginRight: 10
                        
                    }]
                    : [styles.button, {
                        minHeight: 40,
                        justifyContent: 'center',
                        backgroundColor: 'white',
                        marginRight: 10,
                        borderRightWidth: 0,
                        
                    }]
                }
            onPress={() => {this.pokupiPredmete('4. godina', '4')}}
          >
            <Text style={this.state.izabranaGod == '4' ? {color: 'white'}:{color: '#009387'}}>IV god.</Text>
          </SubjectBtn>
        </View>
        <FlatList
          data={this.state.sviPredmeti}
          keyExtractor={(item) => item._id.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => this.onPressHandler(item._id)}>
              <PCard
                style={
                this.izabraniPredmeti.includes(item._id)
                    ? {
                        padding: 10,
                        borderWidth: 1,
                        borderColor: '#009387',
                        backgroundColor: '#009387',
                        flexDirection: 'row',
                      }
                    : {
                        padding: 10,
                        borderColor: '#009387',
                        backgroundColor: 'white',
                        flexDirection: 'row',
                      }
                }
              >
                <Text style={
                  this.izabraniPredmeti.includes(item._id)?[styles.cardText, {flex: 3, marginLeft: 10, color: 'white'}]
                  :[styles.cardText, {flex: 3, marginLeft: 10, color: '#009387'}]}>{item.name}</Text>
                <MaterialIcons
                  size={30} 
                  {...this.izabraniPredmeti.includes(item._id)
                    ? {
                        color: 'white',
                        name: 'check-box'
                      }
                    : {
                        color: '#009387',
                        name: 'check-box-outline-blank'
                    }}
                />
              </PCard>
            </TouchableOpacity>
          )}
          style={{ width: '100%' }}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        />
        <SubjectBtn style={{marginBottom: 20}} onPress={() => {
            this.urediPredmete();
            this.props.navigation.navigate('SviPredmeti');
        }}>
          Sačuvaj izmene
        </SubjectBtn>
        </View>
      );
    }
}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    button: {
        flex: 1,
        marginTop: 10,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#009387',
        backgroundColor: 'white',
        borderRadius: 0,
        minWidth: 90
    },
    cardText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    },
  };

  const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderColor: 'gray',
      borderRadius: 0,
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

export { UrediPredmete };