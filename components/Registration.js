import React, { Component, Fragment } from 'react';
import { View, Text, Button, Platform, StyleSheet, TextInput, Switch, SafeAreaView, KeyboardAvoidingView, Alert } from 'react-native';
import { CustomInput, TextLink, CustomButton, Loading } from './common';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import axios from 'axios';

class Registration extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: '',
      lastName: '',
      username: '',
      password: '',
      jmbg: '',
      email: '',
      error: '',
      loading: false,
      studReg: true,
      regText: 'Student',
      hidePass: true
    };
  }

  registerProf(){
    this.setState({loading: true});
    axios.post("https://attendance-app997.herokuapp.com/api/user/register", {
      type: this.state.regText,
      verified: false,
      name: this.state.name,
      lastName: this.state.lastName,
      username: this.state.username,
      password: this.state.password,
      jmbg: this.state.jmbg,
      email: this.state.email
    })
    .then((response) => {
      Alert.alert('Registracija uspešna!', 'Da bi se prijavili molimo Vas potvrdite svoju E-Mail adresu');
      this.props.authSwitch();
    }).catch((error) => {
      this.setState({loading: false});
      Alert.alert('Greška!', error.response.data);
    })
  }

  render() {
    const { name, lastName, username, password, jmbg, email, regText, error, loading, tipReg } = this.state;
    const setState = state => this.setState(state); // dopusta nam da setujemo stateove
    const promeniTipReg = () => {
      if (this.state.studReg == false)
      {
        setState({studReg: true, regText: 'Student'})
      }
        
      else
      {
        setState({studReg: false, regText: 'Professor'})
      }
        
    }

    return (

      <Fragment>
        <View style={styles.container}>
        <SafeAreaView/>
          {/* ##### HEADER ##### */}
          <View style={styles.header}>
            <View style={{justifyContent: 'flex-end'}}>
              <Text style={styles.text_header}>Registracija</Text>
            </View>
            <View style={{justifyContent: 'flex-end', marginLeft: '35%'}}>
              <Text style={{color: 'white', fontSize: 17, marginBottom: 5}}>{this.state.regText}</Text>
              <Switch 
                onValueChange={promeniTipReg}
                value={!this.state.studReg}
              />
            </View>
          </View>
          
          {/* ##### FOOTER ##### */}
          <View style={styles.footer}>
            
            <View style={{flexDirection: 'row'}}>
              
              {/* ##### IME ##### */}
              <View style={{flexDirection: 'column', width: '50%'}}>
                <Text style={styles.text_footer}>Ime</Text>
                <View style={[styles.action, {
                  marginRight: 20
                }]}>
                  <FontAwesome 
                    name="user-circle"
                    color="#05375a"
                    size={20}
                  />
                  <TextInput 
                    placeholder="Ime"
                    style={styles.textInput}
                    value={name}
                    onChangeText={name => this.setState({name})}
                  />
                </View>
              </View>

              {/* ##### PREZIME ##### */}
              <View style={{flexDirection: 'column', width: '50%'}}>
              <Text style={styles.text_footer}>Prezime</Text>
                <View style={styles.action}>
                  <FontAwesome 
                    name="user-circle"
                    color="#05375a"
                    size={20}
                  />
                  <TextInput 
                    placeholder="Prezime"
                    style={styles.textInput}
                    value={lastName}
                    onChangeText={lastName => this.setState({lastName})}
                  />
                </View>
              </View>
            
            </View>
            
            {/* ##### KORISNICKO IME ##### */}
            <Text style={[styles.text_footer, {
              marginTop: 15
            }]}>Korisničko ime</Text>
            <View style={styles.action}>
              <FontAwesome 
                name="user-o"
                color="#05375a"
                size={20}
              />
              <TextInput 
                placeholder="Korisničko ime"
                style={styles.textInput}
                autoCapitalize="none"
                value={username}
                onChangeText={username => this.setState({username})}
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

            {/* ##### JMBG ##### */}
            <Text style={[styles.text_footer, {
              marginTop: 15
            }]}>JMBG</Text>
            <View style={styles.action}>
              <FontAwesome 
                name="user-o"
                color="#05375a"
                size={20}
              />
              <TextInput 
                placeholder="JMBG"
                style={styles.textInput}
                keyboardType={'numeric'}
                value={jmbg}
                onChangeText={jmbg => this.setState({jmbg})}
              />
            </View>

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

            {this.state.studReg == true ?
              /* ##### BTN REGISTRUJ SE ZA STUDENTA ##### */
              <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 20}}>
                <CustomButton onPress={() => {
                  if(name != '' && lastName!='' && username!='' && password!='' && jmbg!='' && email!='')
                  {
                    if(password.length < 6)
                    Alert.alert('Greška!' , 'Šifra mora da ima najmanje 6 znakova');
                    else
                    this.props.initReg(regText, name, lastName, username, password, jmbg, email);
                  }
                    
                  else
                  Alert.alert('Greška!' , 'Molimo Vas popunite sva polja');
                }}
                >Dalje</CustomButton>
              </View>
              :
              this.state.loading?

              <View style={{alignSelf: 'center', justifyContent: 'center'}}>
                <Loading size={'large'}/>
              </View>

              :

              /* ##### BTN REGISTRUJ SE ZA PROFESORA ##### */
              <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 20}}>
                <CustomButton onPress={() => {
                  if(name != '' && lastName!='' && username!='' && password!='' && jmbg!='' && email!='')
                  {
                    if(email.includes('@np.ac.rs'))
                    this.registerProf();
                    else
                    Alert.alert('Greška!', 'Da bi ste se registrovali kao profesor molimo Vas unesite E-Mail adresu sa domenom @np.ac.rs');
                  }
                  
                  else
                  Alert.alert('Greška!', 'Molimo Vas popunite sva polja')
                }}
                >Registruj se</CustomButton>
              </View>
            }

            

            {/* ##### IDI NA LOGIN PAGE ##### */}
            <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 50}}>
              <Text 
              style={{fontSize: 17}}
              onPress={() => {
                this.props.authSwitch();
              }}>Već imate nalog? <Text style={{color: '#009387'}}>Prijavite se!</Text></Text>
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
      paddingHorizontal: 20,
      paddingBottom: 30
  },
  footer: {
      flex: 7,
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
      fontSize: 19
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

export { Registration };