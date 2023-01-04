import React, { Component } from 'react';
import { View, Button, TouchableOpacity, Text, FlatList } from 'react-native';
import deviceStorage from '../../../services/deviceStorage';
import { PCard, Loading } from '../../../components/common';
import axios from 'axios';

class Danas extends Component {
  constructor(props){
    super(props);
    this.state = {
      jwt: '',
      loading: false,
      account_type: '',
      upisaniPredmeti: [],
      activities: [],
      isFetching: false,
      imaPredavanje: null,
      imaVezbe: null,
      dateAptFrom: null,
      dateAptTo: null,
      dateDateP: null
    };
    this.clock = 0;
    this.sveActivityIDs = [];
    this.loadJWT = deviceStorage.loadJWT.bind(this);
    this.listajPredmete = this.listajPredmete.bind(this);
    this.getActivities = this.getActivities.bind(this);
    this.convertDay = this.convertDay.bind(this);
    this.danasnjeAktivnosti = this.danasnjeAktivnosti.bind(this);
    this.aktivnostiZaDanas = [];
    this.loadJWT();
    
  }

  componentDidUpdate(){
    if(this.state.upisaniPredmeti[0] == null && this.aktivnostiZaDanas.length == 0)
    {
      if(this.clock < 2)
      {
        this.listajPredmete();
        this.clock++;
      }
    }
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

  listajPredmete(){
    axios.post(`https://attendance-app997.herokuapp.com/api/subjects/get-user-subjects/${this.state.jwt}`)
    .then((response) => {
      this.setState({upisaniPredmeti: response.data, loading: true, isFetching: false});
      this.sveActivityIDs = [];
      // uzima sve aktivnosti sa svih predmeta
      for (let i=0; i < response.data.length; i++)
      {
        for(let j=0; j < response.data[i].activities.length; j++)
        {
          this.sveActivityIDs.push(response.data[i].activities[j]);
        }
      }
      this.getActivities();
    })
    .catch((error) => {
      console.log(error);
    });
  };

  vratiImePredmeta(idpredmeta){
    for (let predmet of this.state.upisaniPredmeti)
    {
      if (predmet._id == idpredmeta)
        return predmet.name;
    }
  }

  vratiPredmet(idpredmeta)
  {
    for (let predmet of this.state.upisaniPredmeti)
    {
      if (predmet._id == idpredmeta)
      return predmet;
    }
  }

  getActivities(){
    axios.post("https://attendance-app997.herokuapp.com/api/activities/getByID", {actID: this.sveActivityIDs})
    .then((response) => {
      this.setState({activities: response.data});
      for(let aktivnost of response.data)
      {
        if(aktivnost.type == 'Predavanje')
        {
          this.setState({imaPredavanje: true});
        }
          
        else if(aktivnost.type == 'Vežbe')
          this.setState({imaVezbe: true});
      }
      this.danasnjeAktivnosti();
    }).catch((error) => {
      console.log(error);
    })
  }

  danasnjeAktivnosti(){
    var danas = new Date();
    this.aktivnostiZaDanas = [];
    for (let aktivnost of this.state.activities)
    {
      var danP = new Date(Date.parse(aktivnost.date));
      var dan = danP.getDay();
      var danUM = danP.getDate();
      var mesec = danP.getMonth();
      var godina = danP.getFullYear();
      if(danas.getDay() == dan && danas.getDate() == danUM && danas.getMonth() == mesec && danas.getFullYear() == godina)
      {
        if(!this.aktivnostiZaDanas.includes(aktivnost))
        {
          console.log('nasao');
          this.aktivnostiZaDanas.push(aktivnost);
        }
        
      }
    }
    this.setState({loading: false});
  }

onRefresh(){
    this.setState({isFetching: true,},() => {this.listajPredmete()});
}

afGH(datum){
  var from = new Date(Date.parse(datum.aptFrom));
  var s = from.getHours();
  if (from.getHours() < 10)
    return '0'+from.getHours();
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
    return '0'+from.getHours();
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
    <Text style={{textAlign: 'center', fontSize: 19}}>Nemate aktivnosti za danas</Text>
  </View>
  )
}

_renderItem = ({item, index}) => {
  return (
    <TouchableOpacity onPress={() => this.props.navigation.navigate('OpenAktivnost', {activity: item, imePredmeta: this.vratiImePredmeta(item.subject), predmet: this.vratiPredmet(item.subject)})}>
      <View>
        <View style={{backgroundColor: '#009387', width: '90%', alignSelf: 'center', marginTop: 10, borderTopEndRadius: 5, borderTopStartRadius: 5, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between'}}>
          <Text style={{color: 'white', fontSize: 17, padding: 10}}>{item.type}</Text>
          <Text style={{color: 'white', fontSize: 15, padding: 10}}>{this.vratiImePredmeta(item.subject)}</Text>
        </View>
        <View style={{backgroundColor: 'white', width: '90%', alignSelf: 'center', borderWidth: 1, borderColor: '#009387', borderBottomEndRadius: 5, borderBottomStartRadius: 5}}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 15, padding: 5, color: '#009387'}}>Kabinet br: {item.location}</Text>
            <Text style={{fontSize: 15, padding: 5, color: '#009387'}}>{this.afGH(item)}:{this.afGM(item)} - {this.atGH(item)}:{this.atGM(item)}h</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

  render() {
    return (
        <View style={styles.container}>
        {this.state.loading == true?
          <View style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
            <Loading size={'large'} />
          </View>
        :
          
          <FlatList
            data={this.aktivnostiZaDanas}
            keyExtractor={(item) => item._id.toString()}
            showsHorizontalScrollIndicator={false}
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.isFetching}
            ListEmptyComponent={this._listEmptyComponent}
            renderItem={ this._renderItem}
            style={{ width: '100%' }}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          />
          
        }
          
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

export { Danas };