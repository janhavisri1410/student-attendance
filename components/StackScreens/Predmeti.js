import React, { Component } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { PCard, SubjectBtn } from '../common';
import axios from 'axios';
import deviceStorage from '../../services/deviceStorage';

import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

class Predmeti extends Component {
  constructor(props){
    super(props);
    this.state = {
      jwt: '',
      loading: true,
      account_type: '',
      sviPredmeti: [],
      izabranaGod: ''
    };
    this.upisaniPredmeti = [];
    this.izabraniPredmeti = [];
    this.loadJWT = deviceStorage.loadJWT.bind(this);
    this.pokupiPredmete = this.pokupiPredmete.bind(this);
    this.urediPredmete = this.urediPredmete.bind(this);
    this.upisiMe = this.upisiMe.bind(this);
    this.loadJWT();
    this.initPredmete();
    this.pokupiPredmete('4. godina', '4');
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
    axios.post(`https://attendance-app997.herokuapp.com/api/subjects/get-profile-subjects/${this.props.route.params.jwt}`, {yearOfStudy: godina})
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
    axios.patch(`https://attendance-app997.herokuapp.com/api/users/students/upisiPredmete/${this.props.route.params.jwt}`, {subjects: this.izabraniPredmeti})
      .then((response) => {
        console.log('Student uspesno upisan na sve predmete!');
      }).catch((error) => {
        console.log(error);
      })
  }

  // funkcija koja ce prvo da obrise sve postojece predmete, a zatim poziva funkciju koja ce da upise na sve izabrane
  urediPredmete(){
    axios.patch(`https://attendance-app997.herokuapp.com/api/users/students/odjavi-sa-svih/${this.props.route.params.jwt}`,
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
    return (
        <View style={styles.container}>
          <View style={{ flexDirection: 'row'}}>
          <SubjectBtn
            style={
                this.state.izabranaGod == '1'
                    ? [styles.button, {
                        minHeight: 40,
                        justifyContent: 'center',
                        backgroundColor: 'rgb(0, 132, 208)',
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
            <Text style={this.state.izabranaGod == '1' ? {color: 'white'}:{color: 'rgb(0, 132, 208)'}}>I god.</Text>
          </SubjectBtn>
          <SubjectBtn
            style={
                this.state.izabranaGod == '2'
                    ? [styles.button, {
                        minHeight: 40,
                        justifyContent: 'center',
                        backgroundColor: 'rgb(0, 132, 208)'
                        
                    }]
                    : [styles.button, {
                        minHeight: 40,
                        justifyContent: 'center',
                        backgroundColor: 'white'
                        
                    }]
                }
            onPress={() => {this.pokupiPredmete('2. godina', '2')}}
          >
            <Text style={this.state.izabranaGod == '2' ? {color: 'white'}:{color: 'rgb(0, 132, 208)'}}>II god.</Text>
          </SubjectBtn>
          <SubjectBtn
            style={
                this.state.izabranaGod == '3'
                    ? [styles.button, {
                        minHeight: 40,
                        justifyContent: 'center',
                        backgroundColor: 'rgb(0, 132, 208)'
                        
                    }]
                    : [styles.button, {
                        minHeight: 40,
                        justifyContent: 'center',
                        backgroundColor: 'white'
                        
                    }]
                }
            onPress={() => {this.pokupiPredmete('3. godina', '3')}}
          >
            <Text style={this.state.izabranaGod == '3' ? {color: 'white'}:{color: 'rgb(0, 132, 208)'}}>III god.</Text>
          </SubjectBtn>
          <SubjectBtn
            style={
                this.state.izabranaGod == '4'
                    ? [styles.button, {
                        minHeight: 40,
                        justifyContent: 'center',
                        backgroundColor: 'rgb(0, 132, 208)',
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
            <Text style={this.state.izabranaGod == '4' ? {color: 'white'}:{color: 'rgb(0, 132, 208)'}}>IV god.</Text>
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
                        borderColor: 'rgb(0, 132, 208)',
                        backgroundColor: 'rgb(0, 132, 208)',
                        flexDirection: 'row',
                      }
                    : {
                        padding: 10,
                        borderColor: 'rgb(0, 132, 208)',
                        backgroundColor: 'white',
                        flexDirection: 'row',
                      }
                }
              >
                <Text style={
                  this.izabraniPredmeti.includes(item._id)?[styles.cardText, {flex: 3, marginLeft: 10, color: 'white'}]
                  :[styles.cardText, {flex: 3, marginLeft: 10, color: 'rgb(0, 132, 208)'}]}>{item.name}</Text>
                <MaterialIcons
                  size={30} 
                  {...this.izabraniPredmeti.includes(item._id)
                    ? {
                        color: 'white',
                        name: 'check-box'
                      }
                    : {
                        color: 'rgb(0, 132, 208)',
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
            this.props.navigation.navigate('Prisustvo');
        }}>
          Upisi me
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
        borderColor: 'rgb(0, 132, 208)',
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

export { Predmeti };