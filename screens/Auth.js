import React, { Component } from 'react';
import { View } from 'react-native';
import { Login, Registration, AdditionalReg } from '../components';

export default class Auth extends Component {
  constructor(props){
    super(props);
    this.state = {
      showLogin: true,
      studReg: false,
      additionalReg: false,
      Rtype: '',
      Rname: '',
      RlastName: '',
      Rusername: '',
      Rpassword: '',
      Rjmbg: '',
      Remail: ''
    };
    this.whichForm = this.whichForm.bind(this);
    this.authSwitch = this.authSwitch.bind(this);
    this.whatReg = this.whatReg.bind(this);
    this.initReg = this.initReg.bind(this);
    this.cancelReg = this.cancelReg.bind(this);
  }

  initReg(type, name, lastname, username, password, jmbg, email){
    this.setState({Rtype: type, Rname: name, RlastName: lastname, Rusername: username, Rpassword: password, Rjmbg: jmbg, Remail: email, additionalReg: true})
  }

  whatReg(student){
    this.setState({studReg: student})
    console.log(student);
  }

  cancelReg(){
    this.setState({additionalReg: !this.state.additionalReg})
  }

  authSwitch() {  // menja samo ovo stanje showLogin - kada da prikaze login kada register
    this.setState({showLogin: !this.state.showLogin, additionalReg: false})
  }

  whichForm() { // proverava stanje showLogina i u zavisnosti od toga vraca ili login ili register
    if(!this.state.showLogin){
      if(!this.state.additionalReg){
        return(
          <Registration authSwitch={this.authSwitch} whatReg={this.whatReg} initReg={this.initReg}/>
        );
      } else {
        return(
          <AdditionalReg Rtype={this.state.Rtype} Rname={this.state.Rname} RlastName={this.state.RlastName} Rusername={this.state.Rusername} Rpassword={this.state.Rpassword} Rjmbg={this.state.Rjmbg} Remail={this.state.Remail} cancelReg={this.cancelReg} newJWT={this.props.newJWT} authSwitch={this.authSwitch}/>
        );
      }
      
    } else {
      return(
        <Login newJWT={this.props.newJWT} authSwitch={this.authSwitch}/>
      );
    }
  }

  render() {  // samo crta sta funkcija whichForm vraca
    return(
      <View style={styles.container}>
      {this.whichForm()}
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center'
  }
};