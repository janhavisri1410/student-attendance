import React, { Component } from 'react';
import { View, Button, TouchableOpacity, Text } from 'react-native';
import { CustomButton } from '../components/common/';
import axios from 'axios';

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// PREDMETI
import { SviPredmeti } from './NavigationScreens/Predmeti/SviPredmeti';
import { UrediPredmete } from './NavigationScreens/Predmeti/UrediPredmete';
import { OpenPredmet } from './NavigationScreens/Predmeti/OpenPredmet';
import { DodajPredavanje } from './NavigationScreens/Predmeti/DodajPredavanje';
import { DodajVezbe } from './NavigationScreens/Predmeti/DodajVezbe';
import { UrediPredavanja } from './NavigationScreens/Predmeti/UrediPredavanja';
import { UrediVezbe } from './NavigationScreens/Predmeti/UrediVezbe';


// AKTIVNOSTI
import { Aktivnosti } from './NavigationScreens/Aktivnosti/Aktivnosti';
import { VezPred } from './NavigationScreens/Aktivnosti/VezPred';
import { Prisutnost } from './NavigationScreens/Aktivnosti/Prisutnost';

// DANAS
import { Danas } from './NavigationScreens/Danas/Danas';
import { OpenAktivnost } from './NavigationScreens/Danas/OpenAktivnost';
import { DodajStudenta } from './NavigationScreens/Danas/DodajStudenta';

// STUDENTI
import {Studenti} from './NavigationScreens/Studenti/Studenti';
import {PoPredmetima} from './NavigationScreens/Studenti/PoPredmetima';
import {OpenStudent} from './NavigationScreens/Studenti/OpenStudent';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

class MainProf extends Component {
  constructor(props){
    super(props);
    this.state = {
    };
    this.createDanasStack = this.createDanasStack.bind(this);
    this.createPredmetiStack = this.createPredmetiStack.bind(this);
    this.createAktivnostiStack = this.createAktivnostiStack.bind(this);
  }


  createAktivnostiStack(){ return(
    <Stack.Navigator>
      <Stack.Screen 
        name="piv"
        component={Aktivnosti}
        options={ ({ navigation }) => ({
            title: 'Aktivnosti',
            headerStyle: {backgroundColor: '#009387'},
            headerTintColor: 'white',
            headerLeft: () => (
                <View>
                    <EvilIcons name="navicon" size={35} color="white" style={{marginLeft: 15}} onPress={() => navigation.toggleDrawer()}/>
                </View>
            ),
        })}
      />

      <Stack.Screen 
        name="VezPred"
        component={VezPred}
        options={ ({ navigation }) => ({
            title: 'Vežbe i predavanja',
            headerStyle: {backgroundColor: '#009387'},
            headerTintColor: 'white'
        })}
      />

      <Stack.Screen 
        name="Prisutnost"
        component={Prisutnost}
        options={ ({ navigation }) => ({
            title: 'Prisutnost',
            headerStyle: {backgroundColor: '#009387'},
            headerTintColor: 'white'
        })}
      />
    </Stack.Navigator>
  )
  }

  createDanasStack(){ return(
    <Stack.Navigator>
        <Stack.Screen 
        name="Danas" 
        component={Danas}
        options={ ({ navigation }) => ({
            title: 'Današnje aktivnosti',
            headerStyle: {backgroundColor: '#009387'},
            headerTintColor: 'white',
            headerLeft: () => (
                <View>
                    <EvilIcons name="navicon" size={35} color="white" style={{marginLeft: 15}} onPress={() => navigation.toggleDrawer()}/>
                </View>
            ),
            headerRight: () => (
                <View>
                    <MaterialCommunityIcons name="logout" size={25} style={{color: 'white', marginRight: 15}} onPress={() => this.props.deleteJWT()} />
                </View>
            )
        })}
        />
        <Stack.Screen 
        name="OpenAktivnost" 
        component={OpenAktivnost}
        options={ ({ navigation }) => ({
            title: 'Prisutni',
            headerStyle: {backgroundColor: '#009387'},
            headerTintColor: 'white'
        })}
        />

        <Stack.Screen 
        name="DodajStudenta" 
        component={DodajStudenta}
        options={ ({ navigation }) => ({
            title: 'Dodaj studenta',
            headerStyle: {backgroundColor: '#009387'},
            headerTintColor: 'white'
        })}
        />
    </Stack.Navigator>
  );}

  createPredmetiStack(){return (
    <Stack.Navigator>
        <Stack.Screen 
        name="SviPredmeti" 
        component={SviPredmeti} 
        options={ ({ navigation }) => ({
            title: 'Svi predmeti',
            headerStyle: {backgroundColor: '#009387'},
            headerTintColor: 'white',
            headerLeft: () => (
                <View>
                    <EvilIcons name="navicon" size={35} color="white" style={{marginLeft: 15, marginBottom: -5}} onPress={() => navigation.toggleDrawer()}/>
                </View>
            ),
        })}/>
        <Stack.Screen 
        name="OpenPredmet" 
        component={OpenPredmet}
        options={ ({ navigation }) => ({
            title: 'Podešavanja',
            headerStyle: {backgroundColor: '#009387'},
            headerTintColor: 'white'
        })}
        />
        <Stack.Screen 
        name="UrediPredmete" 
        component={UrediPredmete}
        options={ ({ navigation }) => ({
            title: 'Uredi predmete',
            headerStyle: {backgroundColor: '#009387'},
            headerTintColor: 'white',
            
        })}
        />
        <Stack.Screen 
        name="DodajPredavanje"
        component={DodajPredavanje}
        options={ ({ navigation }) => ({
            title: 'Dodaj',
            headerStyle: {backgroundColor: '#009387'},
            headerTintColor: 'white',
            
        })}
        />
        <Stack.Screen 
        name="DodajVezbe"
        component={DodajVezbe}
        options={ ({ navigation }) => ({
            title: 'Dodaj',
            headerStyle: {backgroundColor: '#009387'},
            headerTintColor: 'white',
            
        })}
        />
        <Stack.Screen 
        name="UrediPredavanja"
        component={UrediPredavanja}
        options={ ({ navigation }) => ({
            title: 'Uredi',
            headerStyle: {backgroundColor: '#009387'},
            headerTintColor: 'white',
            
        })}
        />
        <Stack.Screen 
        name="UrediVezbe"
        component={UrediVezbe}
        options={ ({ navigation }) => ({
            title: 'Uredi',
            headerStyle: {backgroundColor: '#009387'},
            headerTintColor: 'white',
            
        })}
        />
    </Stack.Navigator>
  );}

  createStudentiStack(){return (
    <Stack.Navigator>
      <Stack.Screen 
        name="spp"
        component={PoPredmetima}
        options={ ({ navigation }) => ({
            title: 'Studenti po predmetima',
            headerStyle: {backgroundColor: '#009387'},
            headerTintColor: 'white',
            headerLeft: () => (
                <View>
                    <EvilIcons name="navicon" size={35} color="white" style={{marginLeft: 15, marginBottom: -5}} onPress={() => navigation.toggleDrawer()}/>
                </View>
            ),
            
        })}
      />

      <Stack.Screen 
        name="Studenti"
        component={Studenti}
        options={ ({ navigation }) => ({
            title: 'Studenti',
            headerStyle: {backgroundColor: '#009387'},
            headerTintColor: 'white',
            
        })}
      />

      <Stack.Screen 
        name="OpenStudent"
        component={OpenStudent}
        options={ ({ navigation }) => ({
            title: 'Student',
            headerStyle: {backgroundColor: '#009387'},
            headerTintColor: 'white',
            
        })}
      />
    </Stack.Navigator>
  );}



  render() {

    return (
        <NavigationContainer>
          <Drawer.Navigator drawerType={'back'} drawerStyle={{backgroundColor: '#009387', color: 'white'}} drawerContentOptions={{activeTintColor: '#009387', activeBackgroundColor: 'white', inactiveTintColor: 'white'}} >
            {/* U danas prozoru ce da se nalaze predavanja i vezbe koje ce da ima za danas. Kad klikne na jednu izlistaju mu se svi studenti koji su upisani. Tu ce moci da dodaje i brise studente sa liste prisutnih */}
              <Drawer.Screen name="Danas" children={this.createDanasStack}/>
            {/* U Studenti prozoru ce da se nalaze svi predmeti na koje je upisan. Kada stisne na jedan taj predmet otvorice se svi studenti koji su upisani na taj predmet. Kada stisne na jednog studenta otvorice se detaljan prozor gde ce da pise na koliko casova je bio prisutan, statistika, itd. */}
              <Drawer.Screen name="Studenti" children={this.createStudentiStack}/>
            {/* Predavanja i vezbe. Tu ce da budu izlistane sva predavanja i sve vezbe i tu ce moci da klikne na njih da vidi ko je sve bio prisutan na toj aktivnosti */}
              <Drawer.Screen name="Predavanja/Vezbe" children={this.createAktivnostiStack}/>
            {/* Ovde ce bit svi predmeti na koje je upisan. Tu ce moci da ih dodaje i da ih uklanja. Klikom na neko predavanje/vezbu ce se otvoriti novi prozor gde ce biti prikazan detaljan prikaz - Ime predmeta, profesori koji su na tom predmetu, opis i Vezbe/Predavanja (ovo sam mislio da bude npr nulta activity koja ce da bude kao ta reprezentativna. Na nju ce da klikce i editovanjem ce da menja ostalih 12 koje su zapravo te koje se koriste i koje postoje. Mozda bude potrebno da dodam u backend u subjects array activitija koje ima.) */}
              <Drawer.Screen name="Predmeti" children={this.createPredmetiStack}/>
          </Drawer.Navigator>
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

export { MainProf };