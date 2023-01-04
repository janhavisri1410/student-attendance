import React, { Component } from 'react';
import { View, Text } from 'react-native'
import { Loading } from './components/common/Loading';
import Auth from './screens/Auth';
import LoggedIn from './screens/LoggedIn';
import deviceStorage from './services/deviceStorage.js';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      jwt: '',
      loading: true,
      account_type: ''
    }

    this.newJWT = this.newJWT.bind(this);
    this.deleteJWT = deviceStorage.deleteJWT.bind(this);
    this.loadJWT = deviceStorage.loadJWT.bind(this);
    this.loadJWT();
  }

  newJWT(jwt){
    this.loadJWT();
    this.setState({jwt: jwt});
  } 

  render() {
     if (this.state.loading) {
       return (
         <View style={{flex: 1, justifyContent: 'center'}}>
           <Loading size={'large'} />
         </View>
        );
     } else if (!this.state.jwt) {
       return (
         <Auth newJWT={this.newJWT} />
       );
     } else if (this.state.jwt) {
       return (
         <LoggedIn jwt={this.state.jwt} deleteJWT={this.deleteJWT} account_type={this.state.account_type}/>
       );
    }
  }
}