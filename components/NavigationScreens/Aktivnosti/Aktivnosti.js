import React, { Component } from 'react';
import { View, Button, TouchableOpacity, Text, FlatList, Dimensions } from 'react-native';
import { PCard, Loading } from '../../common';
import axios from 'axios';
import deviceStorage from '../../../services/deviceStorage';
import Entypo from 'react-native-vector-icons/Entypo';


const numCol = 2;


class Aktivnosti extends Component {
  constructor(props){
    super(props);
    this.state = {
      jwt: '',
      loading: true,
      account_type: '',
      isFetching: false,
      upisaniPredmeti: [],
      activities: [],
    };
    this.sveActivityIDs = [];
    this.aktivnosti = [];
    this.loadJWT = deviceStorage.loadJWT.bind(this);
    this.listajPredmete = this.listajPredmete.bind(this);
    this.loadJWT();
  }

  componentDidUpdate(){
    if(this.state.upisaniPredmeti[0] == null)
    {
      this.listajPredmete();
    }
  }

  formatData = (dataList, numColumns) => {
    const totalRows = Math.floor()
  }

  listajPredmete(){
    axios.post(`https://attendance-app997.herokuapp.com/api/subjects/get-user-subjects/${this.state.jwt}`)
    .then((response) => {
      this.setState({loading: false, isFetching: false});
      this.aktivnosti = response.data;    
      
      const totalRows = Math.floor(response.data.length/numCol)
      let totalLastRow = response.data.length - (totalRows * numCol)

      while(totalLastRow !== 0 && totalLastRow !== numCol)
      {
        this.aktivnosti.push({_id: 'x', empty: true})
        totalLastRow ++;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  };

  onRefresh(){
    this.setState({isFetching: true,},() => {this.listajPredmete()});
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

  _renderItem = ({item, index}) => {
    if(item.empty){
      return (
        <View style={[styles.invisItem, {flexDirection: 'row'}]}>
        </View>
      )
    } 
    return (
      <TouchableOpacity style={[styles.item, {flexDirection: 'row'}]} onPress={() => this.props.navigation.navigate('VezPred', {predmet: item})}>
        <Entypo name='book' size={20} color='white'/>
        <Text style={styles.itemText}>{item.name}</Text>
      </TouchableOpacity>
    )
  }
  render() {
    return (
        <View style={styles.container}>
          {this.state.loading==true?
            <View style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
              <Loading size={'large'} />
            </View>
          :
          <FlatList
            contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-start'}}
            data={this.aktivnosti}
            onRefresh={() => this.onRefresh()}
            keyExtractor={(item) => item._id.toString()}
            refreshing={this.state.isFetching}
            numColumns={numCol}
            renderItem={this._renderItem}
          />
          }
        </View>
      );
    }
}

const styles = {
    container: {
      flex: 1,
      paddingTop: 20
    },
    item: {
      backgroundColor: '#009387',
      alignItems: 'center',
      justifyContent: 'center',
      height: 100,
      flex: 1,
      margin: 7,
      borderColor: '#02bdad',
      borderWidth: 2,
      borderRadius: 10,
      padding: 15
    },
    itemText: {
      color: 'white',
      fontSize: 15,
      fontWeight: 'bold',
      margin: 10
    },
    invisItem: {
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
      height: 100,
      flex: 1,
      margin: 7,
      borderColor: 'transparent',
      borderWidth: 2,
      borderRadius: 10,
      padding: 15
    }
  };

export { Aktivnosti };