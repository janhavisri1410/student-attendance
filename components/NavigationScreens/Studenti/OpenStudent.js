import React, { Component } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, DatePickerIOS, TextInput, Alert } from 'react-native';
import axios from 'axios';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';

class OpenStudent extends Component {
    constructor(props){
        super(props);
        this.state = {
            allActivities: [],
            procenatPred: null,
            procenatVez: null
        };
        this.validnaPred = [];
        this.validneVez = [];
        this.getAktivnosti = this.getAktivnosti.bind(this);
        this.getAktivnosti();
        this.danas = new Date();
    }

    getAktivnosti(){
        axios.post("https://attendance-app997.herokuapp.com/api/activities/getBySubject", {subjectID: this.props.route.params.predmetID})
        .then((response) => {
            this.setState({allActivities: response.data});
            for(let datum of response.data)
            {
                var pom = new Date(Date.parse(datum.date));
                if(datum.type == 'Predavanje')
                {
                    if (this.danas >= pom)
                    this.validnaPred.push(datum);
                }

                else if(datum.type == 'Vežbe')
                {
                    if (this.danas >= pom)
                    this.validneVez.push(datum);
                }
            }
            this.nadjiProcenatP();
            this.nadjiProcenatV();
        })
        .catch((error) => {
          console.log(error);
        });
    };

    nadjiProcenatP()
    {
        const deliSa = this.validnaPred.length;
        var bNaPrisutan = 0;

        for (let aktivnost of this.validnaPred)
        {
            if(aktivnost.attendees.includes(this.props.route.params.student._id))
            bNaPrisutan++;
        }
        this.setState({procenatPred: ~~(bNaPrisutan/deliSa * 100)});
    }

    nadjiProcenatV()
    {
        const deliSa = this.validneVez.length;
        var bNaPrisutan = 0;

        for (let aktivnost of this.validneVez)
        {
            if(aktivnost.attendees.includes(this.props.route.params.student._id))
            bNaPrisutan++;
        }
        this.setState({procenatVez: ~~(bNaPrisutan/deliSa * 100)});
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row'}}>
                        <Feather name='user' size={30} style={{marginTop: 20, marginLeft: 20}}/>
                        <Text style={{alignSelf: 'center', fontSize: 17, fontWeight: 'bold', marginTop: 20, marginLeft: 10,color: '#009387'}}>{this.props.route.params.user.name} {this.props.route.params.user.lastName}</Text>
                    </View>
                    
                    <Text style={{marginTop: 22, marginRight: 30, alignSelf: 'center', fontSize: 17, color: '#009387'}}>{this.props.route.params.student.indexNr}</Text>
                </View>
                <View style={{height: 1, width: '90%', backgroundColor: '#009387', alignSelf: 'center'}}/>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{marginLeft: 20, marginTop: 15, fontSize: 17, color: '#009387', fontWeight: 'bold'}}>Departman: </Text>
                    <Text style={{marginTop: 15, marginRight: 20, fontSize: 15}}>{this.props.route.params.student.department} nauke</Text>
                </View>
                
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{marginLeft: 20, marginTop: 10, fontSize: 17, color: '#009387', fontWeight: 'bold'}}>Smer: </Text>
                    <Text style={{marginTop: 10, marginRight: 20, fontSize: 15}}>{this.props.route.params.student.profile}</Text>
                </View>

                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{marginLeft: 20, marginTop: 10, fontSize: 17, color: '#009387', fontWeight: 'bold'}}>Godina studija: </Text>
                    <Text style={{marginTop: 10, marginRight: 20, marginBottom: 10, fontSize: 15}}>{this.props.route.params.student.yearOfStudy}</Text>
                </View>
                <View style={{height: 1, width: '90%', backgroundColor: '#009387', alignSelf: 'center'}}/>

                <View style={{flexDirection: 'row-reverse', marginTop: 15}}>
                    <Text style={{alignSelf: 'center', fontWeight: 'bold', fontSize: 15, marginRight: 20}}>{this.props.route.params.user.email}</Text>
                    <Octicons name='mail' size={30} style={{marginRight: 10}}/>
                </View>

                <Text style={{marginLeft: 20, fontSize: 17, fontWeight: 'bold', marginBottom: 10, marginTop: 50, color: '#009387'}}>Izlaznost na predavanjima i vezbama</Text>
                <View style={{height: 1, width: '90%', backgroundColor: '#009387', alignSelf: 'center', marginBottom: 20}}/>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>

                    <Text style={{width: '45%', textAlign: 'center', fontWeight: 'bold', fontSize: 15, color: '#009387', textDecorationLine: 'underline'}}>
                        Predavanja
                    </Text>
                    <Text style={{width: '45%', textAlign: 'center', fontWeight: 'bold', fontSize: 15, color: '#009387', textDecorationLine: 'underline'}}>
                        Vežbe
                    </Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>

                    <Text style={{width: '45%', textAlign: 'center', fontWeight: 'bold'}}>
                        {this.state.procenatPred}%
                    </Text>
                    <Text style={{width: '45%', textAlign: 'center', fontWeight: 'bold'}}>
                    {this.state.procenatVez}%
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'flex-start'
    }
};

export {OpenStudent}