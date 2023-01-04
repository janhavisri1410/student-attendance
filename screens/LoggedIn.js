import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CustomButton } from '../components/common/';
import { MainComponent } from '../components/MainComponent';
import { InitStudent } from './initialScreens/InitStudent';
import { InitProfessor } from './initialScreens/InitProfessor';
import { Loading } from '../components/common/Loading';
import { MainProf } from '../components/MainProf';
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';
import axios from 'axios';

export default class LoggedIn extends Component {
  constructor(props){
    super(props);
    this.state = {
      isSetUpS: null,
      isSetUpP: null
    };
    this.isSetUp = this.isSetUp.bind(this);
    this.isSetUp();
  }

  componentDidUpdate(){
    if(this.state.isSetUpS == null && this.state.isSetUpP == null)
    {
      this.isSetUp();
    }
  }
  isSetUp(){
      if(this.props.account_type == 'Student'){
        axios.post(`https://attendance-app997.herokuapp.com/api/users/students/is-set-up/${this.props.jwt}`)
          .then((response) => {
            console.log('proverava za studenta');
            this.setState({isSetUpS: response.data});
          }).catch((error) => {
            console.log(error);
          })
      }
      else if(this.props.account_type == 'Professor'){
        axios.post(`https://attendance-app997.herokuapp.com/api/users/professors/is-set-up/${this.props.jwt}`)
          .then((response) => {
            console.log('proverava za profesora');
            this.setState({isSetUpP: response.data});
          }).catch((error) => {
            console.log(error);
          })
      }
  }

  render() {
    const ph = [
      {
        label: 'Odaberi departman',
        value: '',
        color: '#000',
      },
      {
        label: 'Odaberi smer',
        value: '',
        color: '#000'
      }
    ];

    const departmani = [
      {label: 'PRAVNE NAUKE', value: 'Pravne'},
      {label: 'EKONOMSKE NAUKE', value: 'Ekonomske'},
      {label: 'FILOLOŠKE NAUKE', value: 'Filološke'},
      {label: 'FILOZOFSKE NAUKE', value: 'Filozofske'},
      {label: 'MATEMATIČKE NAUKE', value: 'Matematičke'},
      {label: 'TEHNIČKE NAUKE', value: 'Tehničke'},
      {label: 'HEMIJSKO-TEHNOLOŠKE NAUKE', value: 'Hemijsko-Tehnološke'},
      {label: 'BIOMEDICINSKE NAUKE', value: 'Biomedicinske'},
      {label: 'UMETNOST', value: 'Umetničke'},
      {label: 'BIOTEHNIČKE NAUKE U SJENICI', value: 'Biotehničke'}
    ];
      if (this.state.isSetUpS == false){
        return <InitStudent jwt={this.props.jwt} isSetUp={this.isSetUp} account_type={this.props.account_type}/>
      } else if(this.state.isSetUpP == false) {
        return (
        <InitProfessor jwt={this.props.jwt} isSetUp={this.isSetUp}/>
        );
      } else if (this.state.isSetUpS){
        return (
          <MainComponent deleteJWT={this.props.deleteJWT}/>
        );
      } else if (this.state.isSetUpP){
        return (
          <MainProf deleteJWT={this.props.deleteJWT}/>
        );
      } else {
        return (
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Loading size={'large'} />
          </View>
        );
      }
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center'
  }
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});