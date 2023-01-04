import React, { Component } from 'react';
import { View, Button, TouchableOpacity, Text, FlatList } from 'react-native';
import { PCard, Loading } from '../../common';
import axios from 'axios';
import deviceStorage from '../../../services/deviceStorage';

class Prisutnost extends Component {
  constructor(props){
    super(props);
    this.state = {
      jwt: '',
      loading: false,
      account_type: '',
      isFetching: false,
      attendees: [],
      userAtt: [],
      studentAtt: []
    };
    this.getPrisutne = this.getPrisutne.bind(this);
    this.getPrisutne();
  }


  getPrisutne(){
    axios.post("https://attendance-app997.herokuapp.com/api/activities/getAttendees", {activity: this.props.route.params.activity})
    .then((response) => {
      this.prisutniUserIDs = [];
      this.setState({loading: false, isFetching: false, userAtt: response.data[0], studentAtt: response.data[1]});
    })
    .catch((error) => {
      console.log(error);
    });
  };

  onRefresh(){
    this.setState({isFetching: true,},() => {this.getPrisutne()});
  }

nadjiIndex(user){
  for (let i = 0; i < this.state.studentAtt.length; i++)
  {
    if(this.state.studentAtt[i].user == user._id)
    {
      return this.state.studentAtt[i].indexNr;
    }
  }
}

renderHeader = () => {
  //View to set in Header
  return (
    <View style={[styles.header_footer_style, {borderWidth: 1}]}>
      <View style={{width: '10%', justifyContent: 'center', borderRightWidth: 1, marginRight: 5}}>
        <Text style={[styles.textStyle, {width: '100%', marginLeft: 10}]}> rBr </Text>
      </View>
      
      <View style={{width: '50%', justifyContent: 'center', borderRightWidth: 1, marginRight: 5}}>
        <Text style={[styles.textStyle, {width: '100%', marginLeft: 10}]}>Ime i prezime</Text>
      </View>

      <View style={{width: '40%', justifyContent: 'center'}}>
        <Text style={[styles.textStyle, {width: '100%', marginLeft: 10}]}>br. Indexa</Text>
      </View>
    </View>
  );
};

  render() {
    return (
      <View style={styles.container}>
        <View style={{height: 20}}/>
        <View style={styles.container}>
          {this.state.loading==true?
            <View style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
              <Loading size={'large'} />
            </View>
          :
          <FlatList
          data={this.state.userAtt}
          marginBottom={20}
          ListHeaderComponent={this.renderHeader}
          keyExtractor={(item) => item._id.toString()}
          showsHorizontalScrollIndicator={false}
          onRefresh={() => this.onRefresh()}
          refreshing={this.state.isFetching}
          renderItem={({ item, index }) => (
            <View style={[styles.hs, {borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1}]}>
              <View style={{width: '10%', justifyContent: 'center', borderRightWidth: 1, marginRight: 5}}>
                <Text style={[styles.textStyle, {width: '100%', textAlign: 'center'}]}>{index+1}</Text>
              </View>
              
              <View style={{width: '50%', justifyContent: 'center', borderRightWidth: 1, marginRight: 5}}>
                <Text style={[styles.textStyle, {width: '100%', marginLeft: 10}]}>{item.name} {item.lastName}</Text>
              </View>

              <View style={{width: '40%', justifyContent: 'center'}}>
                <Text style={[styles.textStyle, {width: '100%', marginLeft: 10}]}>{this.nadjiIndex(item)}</Text>
              </View>
            </View>
          )}
          style={{ width: '100%' }}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }}
        />
        }
          
        </View>
      </View>
        
      );
    }
}

const styles = {
    container: {
      flex: 1,
      justifyContent: 'center'
    },
    hs: {
      marginLeft: 10,
      flexDirection: 'row',
      marginRight: 10,
      marginBottom: 0,
      height: 45,
      backgroundColor: 'white',
    },
    textStyle: {
      color: '#000',
      fontSize: 15,
      alignSelf: 'center',
    },
    header_footer_style: {
      marginLeft: 10,
      flexDirection: 'row',
      marginRight: 10,
      marginBottom: 0,
      height: 45,
      backgroundColor: 'rgb(216, 216, 216)',
      borderColor: 'black'
    },
};

export { Prisutnost };