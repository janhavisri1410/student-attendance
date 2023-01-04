import React, { Component } from 'react';
import { View, Button, TouchableOpacity, Text, FlatList } from 'react-native';
import { PCard, Loading } from '../../common';
import axios from 'axios';
import deviceStorage from '../../../services/deviceStorage';

class VezPred extends Component {
  constructor(props){
    super(props);
    this.state = {
      jwt: '',
      loading: true,
      account_type: '',
      isFetching: false,
      upisaniPredmeti: [],
      activities: [],
      prazno: false,
    };
    this.sveActivityIDs = [];
    this.danasnjiDan = new Date();
    this.count = 0;
    this.loadJWT = deviceStorage.loadJWT.bind(this);
    this.getActivities = this.getActivities.bind(this);
    this.loadJWT();
  }

  componentDidUpdate(){
    if(this.state.activities[0] == null)
    {
      if(this.count < 2)
      {
        this.getActivities();
        this.count++;
      }
      
    }
  }

  getActivities(){
    axios.post("https://attendance-app997.herokuapp.com/api/activities/getByID", {actID: this.props.route.params.predmet.activities})
    .then((response) => {
      if(response.data.length == 0)
        this.setState({activities: response.data, loading: false, isFetching: false, prazno: true});
      else
      this.setState({activities: response.data, loading: false, isFetching: false});
    }).catch((error) => {
      console.log(error);
    })
  }

  onRefresh(){
    this.setState({isFetching: true,},() => {this.getActivities()});
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

dalijeBio(item){
  var aktivnostDate = new Date(Date.parse(item.date));
  var aptFromDate = new Date(Date.parse(item.aptFrom));

  if(aktivnostDate.getTime() > this.danasnjiDan.getTime())
  {
    return true;
  }
  else return false;

}

  render() {
    return (
        <View style={styles.container}>
          {this.state.loading==true?
            <View style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
              <Loading size={'large'} />
            </View>
          :
          this.state.prazno?
            <View style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
              <Text style={{fontSize: 15}}>Predmet nema nikakva predavanja ni vežbe</Text>
            </View>
          :
          <FlatList
            data={this.state.activities}
            marginTop={20}
            marginBottom={20}
            keyExtractor={(item) => item._id.toString()}
            showsHorizontalScrollIndicator={false}
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.isFetching}
            renderItem={({ item }) => (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Prisutnost', {activity: item})}>
                <PCard
                    style={
                      
                      this.dalijeBio(item)?
                      {
                        padding: 10,
                        borderWidth: 1,
                        borderColor: '#009387',
                        backgroundColor: 'rgb(217, 217, 217)',
                        flexDirection: 'row',
                      }
                    :
                      {
                      padding: 10,
                        borderWidth: 1,
                        borderColor: '#009387',
                        backgroundColor: '#009387',
                        flexDirection: 'row'
                      }}
                >
                <View style={{flex: 1, flexDirection: 'row', }}>
                    <Text style={[styles.cardText, {flex: 3, marginLeft: 10, fontSize: 15}]}>{this.drawDate(item.date)}</Text>
                    <Text style={[styles.cardText, {flex: 1, marginLeft: 10, fontSize: 15, textAlign: 'right'}]}>{item.type}</Text>
                </View>
                    
                </PCard>
            </TouchableOpacity>
            )}
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

export { VezPred };