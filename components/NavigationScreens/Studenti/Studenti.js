import React, { Component } from 'react';
import { View, Button, TouchableOpacity, Text, FlatList, TextInput } from 'react-native';
import { Loading, PCard } from '../../common';
import axios from 'axios';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

class Studenti extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      isFetching: false,
      eStud: [],
      eUsers: [],
      filterU: []
    };

    this.getUpisane = this.getUpisane.bind(this);
    this.getUpisane();
  }

  getUpisane(){
    axios.post("https://attendance-app997.herokuapp.com/api/subjects/get-students", {subjID: this.props.route.params.predmet._id})
    .then((response) => {
      this.setState({loading: false, isFetching: false, eStud: response.data[0], eUsers: response.data[1], filterU: response.data[1]});
    })
    .catch((error) => {
      console.log(error);
    });
  };

  nadjiIndex(user){
    for (let i = 0; i < this.state.eStud.length; i++)
    {
      if(this.state.eStud[i].user == user._id)
      {
        return this.state.eStud[i].indexNr;
      }
    }
  };

  nadjiStudenta(user){
    for (let i = 0; i < this.state.eStud.length; i++)
    {
      if(this.state.eStud[i].user == user._id)
      {
        return this.state.eStud[i];
      }
    }
  }

  onRefresh(){
    this.setState({isFetching: true,},() => {this.getUpisane()});
  }

  studentSearch(txt){
    this.setState({
      filterU: this.state.eUsers.filter(function(i) {
        if(i.name.toLowerCase().includes(txt.toLowerCase()) || i.lastName.toLowerCase().includes(txt.toLowerCase()))
        return true;
      }
      )
    })
  }

  render() {
    return (
      <View style={styles.container}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{marginLeft: 22, marginTop: 20, fontSize: 19, fontWeight: 'bold', color: '#009387'}}>{this.state.eUsers.length} Studenata </Text>
        <TextInput placeholder="Pretraga" style={{alignSelf: 'center', fontSize: 17, marginRight: 20, marginTop: 15, backgroundColor: 'white', width: 220, padding: 5, borderRadius: 5, borderColor: 'gray', borderWidth: 0.2}} onChangeText={text => this.studentSearch(text)}/>
        </View>
          {this.state.loading==true?
            <View style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
              <Loading size={'large'} />
            </View>
          :
          <FlatList
          data={this.state.filterU}
          marginTop={10}
          marginBottom={20}
          keyExtractor={(item) => item._id.toString()}
          showsHorizontalScrollIndicator={false}
          onRefresh={() => this.onRefresh()}
          refreshing={this.state.isFetching}
          renderItem={({ item }) => (
            <View>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('OpenStudent', {user: item, student: this.nadjiStudenta(item), predmetID: this.props.route.params.predmet._id})}>
              <PCard
                style={{
                    padding: 10,
                    height: 'auto',
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: '#009387',
                    backgroundColor: 'white',
                    flexDirection: 'row',      
                }}
              >
              <View style={{flex: 1, flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row'}}>
                  <Feather name="user" size={45} style={{marginRight: 10}}/>
                  <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                    <Text style={{fontSize: 17, fontWeight: 'bold'}}>{item.name} {item.lastName}</Text>
                    <Text>{this.nadjiIndex(item)}</Text>
                  </View>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={30} style={{alignSelf: 'center'}}/>
              </View>
                
              </PCard>
              </TouchableOpacity>
            </View>
          )}
          style={{ width: '100%' }}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }}
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

export { Studenti };