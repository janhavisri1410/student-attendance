import React, { Component, Fragment } from 'react';
import { View, Text, Button, Platform, StyleSheet, TextInput, Switch, SafeAreaView, KeyboardAvoidingView, Alert } from 'react-native';
import { CustomInput, TextLink, CustomButton, Loading } from './common';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import axios from 'axios';
import deviceStorage from '../services/deviceStorage';

class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: '',
      password_confirmation: '',
      error: '',
      loading: false,
      hidePass: true
    };
    this.loginUser = this.loginUser.bind(this);
  }


  loginUser() {
    const { email, password } = this.state;

    this.setState({ error: '', loading: true });

    axios.post("https://attendance-app997.herokuapp.com/api/user/login",{
        email: email,
        password: password
    })
    .then((response) => {
      deviceStorage.saveItem('id_token', response.data);
      this.props.newJWT(response.data);
    })
    .catch((error) => {
      this.setState({ loading: false });
      Alert.alert('Greška!', error.response.data);
    });
  }

  render() {
    const { email, password, error, loading } = this.state;
    const setState = state => this.setState(state); // dopusta nam da setujemo stateove
    const promeniTipReg = () => {
      if (this.state.studReg == false)
      {
        setState({studReg: true, regText: 'Student'})
      }
        
      else
      {
        setState({studReg: false, regText: 'Profesor'})
      }
        
    }

    return (

      <Fragment>
        <View style={styles.container}>
        <SafeAreaView/>
          {/* ##### HEADER ##### */}
          <View style={styles.header}>
            <View style={{justifyContent: 'flex-end'}}>
              <Text style={styles.text_header}>ermin</Text>
            </View>
          </View>

          {/* ##### FOOTER ##### */}
          <View style={styles.footer}>
        
            {/* ##### EMAIL ##### */}
            <Text style={[styles.text_footer, {
              marginTop: 15
            }]}>E-Mail</Text>
            <View style={styles.action}>
              <Fontisto 
                name="email"
                color="#05375a"
                size={20}
              />
              <TextInput 
                placeholder="E-Mail"
                style={styles.textInput}
                autoCapitalize="none"
                value={email}
                onChangeText={email => this.setState({email})}
              />
            </View>

            {/* ##### SIFRA ##### */}
            <Text style={[styles.text_footer, {
              marginTop: 15
            }]}>Šifra</Text>
            <View style={styles.action}>
              <FontAwesome 
                name="lock"
                color="#05375a"
                size={20}
              />
              <TextInput 
                placeholder="Šifra"
                style={styles.textInput}
                autoCapitalize="none"
                secureTextEntry={this.state.hidePass}
                value={password}
                onChangeText={password => this.setState({password})}
              />
              {this.state.hidePass?
                <Feather 
                name="eye-off"
                color="grey"
                size={20}
                onPress={() => this.setState({hidePass: false})}
                />
              :
                <Feather 
                name="eye"
                color="grey"
                size={20}
                onPress={() => this.setState({hidePass: true})}
                />
              }
              
            </View>

            {/* ##### PRIJAVI SE ##### */}
            {!loading ?
            <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 20}}>
              <CustomButton 
              onPress={() => {
                if(email!='' && password!='')
                this.loginUser();
                else
                Alert.alert('Upozorenje', 'Molimo Vas popunite sva polja!')
                }}>Prijavi se</CustomButton>
            </View>
            :
            <View style={{marginTop: 20}}>
              <Loading style={{marginTop: 20}} size={'large'} />
            </View>
            }
            

            {/* ##### IDI NA REGISTRACIJU ##### */}
            <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 50}}>
              <Text 
              style={{fontSize: 17}}
              onPress={() => {
                this.props.authSwitch();
              }}>Nemate nalog? <Text style={{color: '#009387'}}>Registrujte se!</Text></Text>
            </View>

          </View>
        </View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%', 
    backgroundColor: '#009387'
  },
  header: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingBottom: 30
  },
  footer: {
      flex: 2,
      backgroundColor: '#fff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingHorizontal: 20,
      paddingVertical: 30
  },
  text_header: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 30
  },
  text_footer: {
      color: '#05375a',
      fontSize: 18,
      marginBottom: -5
  },
  action: {
      flexDirection: 'row',
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#f2f2f2',
      paddingBottom: 5
  },
  actionError: {
      flexDirection: 'row',
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#FF0000',
      paddingBottom: 5
  },
  textInput: {
      flex: 1,
      marginTop: Platform.OS === 'ios' ? 0 : -12,
      paddingLeft: 10,
      color: '#05375a',
      fontSize: 17
  },
  errorMsg: {
      color: '#FF0000',
      fontSize: 14,
  },
  button: {
      alignItems: 'center',
      marginTop: 50
  },
  signIn: {
      width: '100%',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10
  },
  textSign: {
      fontSize: 18,
      fontWeight: 'bold'
  }
});

export { Login };