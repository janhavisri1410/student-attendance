import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Button,
  Alert
} from 'react-native';
import { Card, SubjectBtn } from '../../components/common'; //vodi racuna
import axios from 'axios'; //axios da ti je instaliran
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // moras da instaliras react-native-vector-icons..pogledaj na net koja je komanda
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const STATUS_BAR = StatusBar.statusBarHeight || 24; 

class InitStudent extends Component {
  constructor(props) {
    super(props);
    this.state = {
        izabranaGod: '',
        predmeti: []
    };
    this.izabraniPredmeti = [];
    this.postavi = this.postavi.bind(this);
    this.pokupiPredmete = this.pokupiPredmete.bind(this);
    this.upisiMe = this.upisiMe.bind(this);

    this.pokupiPredmete('4. godina', '4');
  }

  pokupiPredmete(godina, btn){
    axios.post(`https://attendance-app997.herokuapp.com/api/subjects/get-profile-subjects/${this.props.jwt}`, {yearOfStudy: godina})
      .then((response) => {
        this.setState({predmeti: response.data, izabranaGod: btn})
      }).catch((error) => {
        console.log(error);
      })
  }

  upisiMe(){
    axios.patch(`https://attendance-app997.herokuapp.com/api/users/students/upisiPredmete/${this.props.jwt}`, {subjects: this.izabraniPredmeti})
      .then((response) => {
        console.log('Student uspesno upisan na sve predmete!');
        this.props.isSetUp();
      }).catch((error) => {
        console.log(error);
      })
  }

  onPressHandler(id) {
    let renderData = [...this.state.predmeti];
    for (let data of renderData) {
      if (data._id == id) {
        data.selected = data.selected == null ? true : !data.selected;
        if (!this.izabraniPredmeti.includes(data._id)) {
          this.izabraniPredmeti.push(data._id);
        } else {
          this.izabraniPredmeti = this.izabraniPredmeti.filter(
            (item) => item != data._id
          );
        }
        break;
      }
    }
    this.setState({ predmeti: renderData });
    console.log(this.izabraniPredmeti);
  }

  postavi(broj){
      this.setState({izabranaGod: broj});
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={{height: STATUS_BAR, width: '100%', backgroundColor: '#009387'}}></View>
        <View style={{height: STATUS_BAR*1.7, width: '100%', backgroundColor: '#009387', justifyContent: 'center'}}>
          <Text style={[styles.cardText, {marginLeft: 10}]}>Odaberi predmete</Text>
        </View>
        <View style={{ flexDirection: 'row'}}>
          <SubjectBtn
            style={
                  this.state.izabranaGod == '1'
                    ? [styles.button, {
                        minHeight: 40,
                        justifyContent: 'center',
                        backgroundColor: '#009387',
                        marginLeft: 10
                        
                    }]
                    : [styles.button, {
                        minHeight: 40,
                        justifyContent: 'center',
                        backgroundColor: 'white',
                        marginLeft: 10
                        
                    }]
                }
            onPress={() => {this.pokupiPredmete('1. godina', '1')}}
          >
            <Text style={this.state.izabranaGod == '1' ? {color: 'white'}:{color: '#009387'}}>I god.</Text>
          </SubjectBtn>
          <SubjectBtn
            style={
                  this.state.izabranaGod == '2'
                    ? [styles.button, {
                        minHeight: 40,
                        justifyContent: 'center',
                        backgroundColor: '#009387'
                        
                    }]
                    : [styles.button, {
                        minHeight: 40,
                        justifyContent: 'center',
                        backgroundColor: 'white'
                        
                    }]
                }
            onPress={() => {this.pokupiPredmete('2. godina', '2')}}
          >
            <Text style={this.state.izabranaGod == '2' ? {color: 'white'}:{color: '#009387'}}>II god.</Text>
          </SubjectBtn>
          <SubjectBtn
            style={
                    this.state.izabranaGod == '3'
                    ? [styles.button, {
                        minHeight: 40,
                        justifyContent: 'center',
                        backgroundColor: '#009387'
                        
                    }]
                    : [styles.button, {
                        minHeight: 40,
                        justifyContent: 'center',
                        backgroundColor: 'white'
                        
                    }]
                }
            onPress={() => {this.pokupiPredmete('3. godina', '3')}}
          >
            <Text style={this.state.izabranaGod == '3' ? {color: 'white'}:{color: '#009387'}}>III god.</Text>
          </SubjectBtn>
          <SubjectBtn
            style={
                  this.state.izabranaGod == '4'
                    ? [styles.button, {
                        minHeight: 40,
                        justifyContent: 'center',
                        backgroundColor: '#009387',
                        borderRightWidth: 0,
                        marginRight: 10
                        
                    }]
                    : [styles.button, {
                        minHeight: 40,
                        justifyContent: 'center',
                        backgroundColor: 'white',
                        marginRight: 10,
                        borderRightWidth: 0,
                        
                    }]
                }
            onPress={() => {this.pokupiPredmete('4. godina', '4')}}
          >
            <Text style={this.state.izabranaGod == '4' ? {color: 'white'}:{color: '#009387'}}>IV god.</Text>
          </SubjectBtn>
        </View>
        <FlatList
          data={this.state.predmeti}
          keyExtractor={(item) => item._id.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => this.onPressHandler(item._id)}>
              <Card
                style={
                  this.izabraniPredmeti.includes(item._id)
                    ? {
                        padding: 10,
                        borderRadius: 15,
                        borderColor: '#009387',
                        backgroundColor: '#009387',
                        flexDirection: 'row',
                      }
                    : {
                        padding: 10,
                        borderRadius: 15,
                        borderColor: '#009387',
                        backgroundColor: 'white',
                        flexDirection: 'row',
                      }
                }
              >
                <Text style={
                  this.izabraniPredmeti.includes(item._id)?[styles.cardText, {flex: 3, marginLeft: 10, color: 'white'}]
                  :[styles.cardText, {flex: 3, marginLeft: 10, color: '#009387'}]}>{item.name}</Text>
                <MaterialIcons
                  size={30} 
                  {...this.izabraniPredmeti.includes(item._id)
                    ? {
                        color: 'white',
                        name: 'check-box'
                      }
                    : {
                        color: '#009387',
                        name: 'check-box-outline-blank'
                    }}
                />
              </Card>
            </TouchableOpacity>
          )}
          style={{ width: '100%' }}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        />

        <View style={{backgroundColor: '#009387', height: 100, width: '100%'}}>
          <SubjectBtn style={{borderColor: 'white', borderWidth: 3, borderRadius: 5, width: '80%', alignSelf: 'center', marginTop: 10, padding: 5}}
          onPress={() => {
            if(this.izabraniPredmeti.length == 0)
            {
              Alert.alert('Upozorenje!', 'Izaberite barem jedan predmet');
            }
            else
            this.upisiMe();
            
          }}><Text style={{color: 'white', fontSize: 21}}>Upiši me ({this.izabraniPredmeti.length})</Text>
          </SubjectBtn>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  cardText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  checkButton: {
    height: 60,
    width: 200,
  },
  button: {
    flex: 1,
    marginTop: 10,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#009387',
    backgroundColor: 'white',
    borderRadius: 0,
    minWidth: 90
  },
});

export { InitStudent };
