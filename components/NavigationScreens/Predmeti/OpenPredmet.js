import React, { Component } from 'react';
import { View, Button, TouchableOpacity, FlatList, Text } from 'react-native';
import { StaffCard, Loading } from '../../common';
import axios from 'axios';

class OpenPredmet extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      nastavnoOsoblje: [],
      activities: [],
      imaPredavanje: null,
      imaVezbe: null,
      dateAptFrom: null,
      dateAptTo: null,
      dateDateP: null,
      dateAptFromV: null,
      dateAptToV: null,
      dateDateV: null,
      PLocation: null,
      VLocation: null
    };
    this.allPredavanja = [];
    this.allVezbe = [];
    this.profesoriNaPredmetu = this.profesoriNaPredmetu.bind(this);
    this.getActivities = this.getActivities.bind(this);
    this.convertDay = this.convertDay.bind(this);
    this.profesoriNaPredmetu();
    this.getActivities();
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

  // ovde cu da napraavim da proverava kojoj vrsti aktivnosti pripada. Prolazi kroz sve activities i ako je predavanje pusha ga u niz za predavanja, ako je vezba u niz za vezbu. Posle taj niz stavim kao state.
  getActivities(){
    axios.post("https://attendance-app997.herokuapp.com/api/activities/getByID", {actID: this.props.route.params.izabranPredmet.activities})
    .then((response) => {
      this.setState({activities: response.data, loading: false});
      for(let aktivnost of response.data)
      {
        if(aktivnost.type == 'Predavanje')
        {
          var from = new Date(Date.parse(aktivnost.aptFrom));
          var pom = new Date();
          var to = new Date(Date.parse(aktivnost.aptTo));
          var danDate = new Date(Date.parse(aktivnost.date));
          var dan = this.convertDay(danDate.getDay());
          var lokacija = aktivnost.location;
          this.allPredavanja.push(aktivnost._id);
          this.setState({imaPredavanje: true, dateAptFrom: from, dateAptTo: to, dateDateP: dan, PLocation: lokacija});
        }
          
        else if(aktivnost.type == 'Vežbe')
        {
          var from = new Date(Date.parse(aktivnost.aptFrom));
          var to = new Date(Date.parse(aktivnost.aptTo));
          var danDate = new Date(Date.parse(aktivnost.date));
          var dan = this.convertDay(danDate.getDay());
          var lokacija = aktivnost.location;
          this.allVezbe.push(aktivnost._id);
          this.setState({imaVezbe: true, dateAptFromV: from, dateAptToV: to, dateDateV: dan, VLocation: lokacija});
        }
          
      }
    }).catch((error) => {
      console.log(error);
    })
  }

  profesoriNaPredmetu(){
    axios.post("https://attendance-app997.herokuapp.com/api/users/professors/identifyProfessors", {professors: this.props.route.params.izabranPredmet.professors})
    .then((response) => {
      this.setState({nastavnoOsoblje: response.data});
    }).catch((error) => {
      console.log(error);
    })
  }

  adjustTime(vreme){
    var s = vreme;
    if (vreme < 10)
      return '0'+vreme;
    return s;
  }

  render() {
    return (
        <View style={styles.container}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 19, marginTop: 20, marginLeft: 20, marginBottom: 7, color: '#009387', fontWeight: 'bold'}}>{this.props.route.params.izabranPredmet.name} </Text>
          </View>
          <View style={{height: 1, width: '90%', backgroundColor: '#009387', alignSelf: 'center'}}/>
          <Text style={{fontSize: 19, marginTop: 10, marginLeft: 20, marginBottom: 7, color: '#009387', fontStyle: 'italic'}}>{this.props.route.params.izabranPredmet.description} </Text>
          <Text style={{fontSize: 17, fontWeight: '500', marginHorizontal: 20, marginTop: 30, color: '#009387'}}>Nastavno osoblje na ovom predmetu</Text>
          <View style={{height: 1, width: '90%', backgroundColor: '#009387', alignSelf: 'center'}}/>
          <View style={{marginTop: 10, width: '90%', alignSelf: 'center'}}>
           <FlatList
            horizontal={true}
            height={55}
            data={this.state.nastavnoOsoblje}
            keyExtractor={(item) => item._id.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <StaffCard
                style={{
                    padding: 10,
                    borderWidth: 1,
                    borderColor: '#009387',
                    backgroundColor: '#009387',
                    flexDirection: 'row'      
                }}
              >
                <Text style={[styles.cardText, {color: 'white', fontSize: 17}]}>{item.name} {item.lastName}</Text>
              </StaffCard>
            )}
            style={{ width: '100%' }}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
            /> 
          </View>

        {/* PREDAVANJA */}
        <Text style={{fontSize: 17, fontWeight: '500', marginHorizontal: 20, marginTop: 50, color: '#009387'}}>Predavanja iz ovog predmeta</Text>
        <View style={{height: 1, width: '90%', backgroundColor: '#009387', alignSelf: 'center'}}/>
        
        {this.state.loading == true?
          <View>
              <Loading size={'large'} />
          </View>
          :
          this.state.imaPredavanje == true?
          <TouchableOpacity onPress={() => this.props.navigation.navigate('UrediPredavanja', {activity: this.allPredavanja})}>
            <View style={{backgroundColor: '#009387', width: '90%', alignSelf: 'center', marginTop: 10, borderTopEndRadius: 5, borderTopStartRadius: 5, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between'}}>
              <Text style={{color: 'white', fontSize: 17, padding: 10}}>Predavanje</Text>
              <Text style={{color: 'white', fontSize: 15, padding: 10}}>{this.state.dateDateP}</Text>
            </View>
            <View style={{backgroundColor: 'white', width: '90%', alignSelf: 'center', borderWidth: 1, borderColor: '#009387', borderBottomEndRadius: 5, borderBottomStartRadius: 5}}>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 15, padding: 5, color: '#009387'}}>Kabinet br: {this.state.PLocation}</Text>
                <Text style={{fontSize: 15, padding: 5, color: '#009387'}}>{this.adjustTime(this.state.dateAptFrom.getHours())}:{this.adjustTime(this.state.dateAptFrom.getMinutes())} - {this.adjustTime(this.state.dateAptTo.getHours())}:{this.adjustTime(this.state.dateAptTo.getMinutes())}h</Text>
              </View>
            </View>
          </TouchableOpacity>
          
        :

          <TouchableOpacity style={{width: '90%', alignSelf: 'center', marginTop: 30}} onPress={() => this.props.navigation.navigate('DodajPredavanje', {subject: this.props.route.params.izabranPredmet})}>
            <Text style={{fontSize: 17, color: 'black', alignSelf: 'center'}}>Ovaj predmet trenutno nema predavanja. <Text style={{fontSize: 17, color: '#009387'}}>Dodaj!</Text> </Text>
          </TouchableOpacity>
        }
        
        
        
        {/* VEZBE */}
        <Text style={{fontSize: 17, fontWeight: '500', marginHorizontal: 20, marginTop: 30, color: '#009387'}}>Vežbe iz ovog predmeta</Text>
        <View style={{height: 1, width: '90%', backgroundColor: '#009387', alignSelf: 'center'}}/>

        {this.state.loading == true?
          <View>
              <Loading size={'large'} />
          </View>
        :
        this.state.imaVezbe == true?
        <TouchableOpacity onPress={() => this.props.navigation.navigate('UrediVezbe', {activity: this.allVezbe})}>
          <View style={{backgroundColor: '#009387', width: '90%', alignSelf: 'center', marginTop: 10, borderTopEndRadius: 5, borderTopStartRadius: 5, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between'}}>
            <Text style={{color: 'white', fontSize: 17, padding: 10}}>Vežbe</Text>
            <Text style={{color: 'white', fontSize: 15, padding: 10}}>{this.state.dateDateV}</Text>
          </View>
          <View style={{backgroundColor: 'white', width: '90%', alignSelf: 'center', borderWidth: 1, borderColor: '#009387', borderBottomEndRadius: 5, borderBottomStartRadius: 5}}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <Text style={{fontSize: 15, padding: 5, color: '#009387'}}>Kabinet br: {this.state.VLocation}</Text>
              <Text style={{fontSize: 15, padding: 5, color: '#009387'}}>{this.adjustTime(this.state.dateAptFromV.getHours())}:{this.adjustTime(this.state.dateAptFromV.getMinutes())} - {this.adjustTime(this.state.dateAptToV.getHours())}:{this.adjustTime(this.state.dateAptToV.getMinutes())}h</Text>
            </View>
          </View>
        </TouchableOpacity>
        :

        <TouchableOpacity style={{width: '90%', alignSelf: 'center', marginTop: 30}} onPress={() => this.props.navigation.navigate('DodajVezbe', {subject: this.props.route.params.izabranPredmet, listaj: this.props.route.params.listaj})}>
        <Text style={{fontSize: 17, color: 'black', alignSelf: 'center'}}>Ovaj predmet trenutno nema vežbe. <Text style={{fontSize: 17, color: '#009387'}}>Dodaj!</Text> </Text>
        </TouchableOpacity>
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

export { OpenPredmet };