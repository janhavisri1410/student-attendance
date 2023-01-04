import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Button,
  Alert
} from 'react-native';
import { Card, SubjectBtn } from '../../components/common';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';
import axios from 'axios';

const STATUS_BAR = StatusBar.statusBarHeight || 24; 

class InitProfessor extends Component {
  constructor(props) {
    super(props);
    this.state = {
        izabranaGod: '',
        predmeti: [],
        department: '',
        profile: ''
    };
    this.izabraniPredmeti = [];
    this.postavi = this.postavi.bind(this);
    this.pokupiPredmete = this.pokupiPredmete.bind(this);
    this.upisiMe = this.upisiMe.bind(this);
  }

  //radi
  pokupiPredmete(godina, btn){
    axios.post("https://attendance-app997.herokuapp.com/api/subjects/get-specific-subjects", {department: this.state.department, profile: this.state.profile, yearOfStudy: godina})
      .then((response) => {
        this.setState({predmeti: response.data, izabranaGod: btn})
      }).catch((error) => {
        console.log(error);
      })
  }

  upisiMe(){
    axios.patch(`https://attendance-app997.herokuapp.com/api/users/professors/dodajPredmete/${this.props.jwt}`, {subjects: this.izabraniPredmeti})
      .then((response) => {
        console.log('Profesor uspesno dodao sve predmete!');
        this.props.isSetUp();
      }).catch((error) => {
        console.log(error);
      })
  }

  onPressHandler(id) {
    let renderData = [...this.state.predmeti];
    for (let data of renderData) {
      if (data._id == id) {
        data.selected = data.selected == null ? true : !data.selected;
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

  postavi(broj){
      this.setState({izabranaGod: broj});
  }

  render() {
    const { department, profile, yos, index, loading, tipReg } = this.state;
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
        <View style={{height: STATUS_BAR, width: '100%', backgroundColor: '#009387'}}></View>
        <View style={{height: STATUS_BAR*1.7, width: '100%', backgroundColor: '#009387', justifyContent: 'center'}}>
          <Text style={[styles.cardText, {marginLeft: 10}]}>Odaberi predmete</Text>
        </View>

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
        <SubjectBtn>{this.props.account_type}</SubjectBtn>

        <FlatList
          data={this.state.predmeti}
          keyExtractor={(item) => item._id.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => this.onPressHandler(item._id)}>
              <Card
                style={
                  this.izabraniPredmeti.includes(item._id)
                    ? {
                        padding: 10,
                        borderRadius: 0,
                        borderColor: '#009387',
                        backgroundColor: '#009387',
                        flexDirection: 'row',
                      }
                    : {
                        padding: 10,
                        borderRadius: 0,
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
              </Card>
            </TouchableOpacity>
          )}
          style={{ width: '100%' }}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        />
        

        <View style={{backgroundColor: '#009387', height: 100, width: '100%'}}>
          <SubjectBtn style={{borderColor: 'white', borderWidth: 3, borderRadius: 5, width: '80%', alignSelf: 'center', marginTop: 10, padding: 5}}
          onPress={() => {
            if(this.izabraniPredmeti.length == 0)
            {
              Alert.alert('Upozorenje!', 'Izaberite barem jedan predmet');
            }
            else
            this.upisiMe();
            
          }}><Text style={{color: 'white', fontSize: 21}}>Dodaj predmete ({this.izabraniPredmeti.length})</Text>
          </SubjectBtn>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  cardText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  checkButton: {
    height: 60,
    width: 200,
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
  text_footer: {
    color: '#05375a',
    fontSize: 18,
    marginBottom: -5
},
});

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

export { InitProfessor };
