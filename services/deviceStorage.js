import { AsyncStorage } from 'react-native';
import axios from 'axios';

const deviceStorage = {
    async loadJWT() {
        try {
          const value = await AsyncStorage.getItem('id_token');
          if (value !== null) {
            axios.post(`https://attendance-app997.herokuapp.com/api/user/login/${value}`)
              .then((response) => {
                this.setState({
                  jwt: value,
                  loading: false,
                  account_type: response.data
                });
              }).catch((error) => {console.log(error); this.setState({jwt: '', loading: false, account_type:''})});
          } else {
            this.setState({
              loading: false
            });
          }
        } catch (error) {
          console.log('AsyncStorage Error: ' + error.message);
        }
    },


    async saveItem(key, value) {
        try {
          await AsyncStorage.setItem(key, value);
        } catch (error) {
          console.log('AsyncStorage Error: ' + error.message);
        }
    },


    async deleteJWT() {
        try{
          await AsyncStorage.removeItem('id_token')
          .then(
            () => {
              this.setState({
                jwt: ''
              })
            }
          );
        } catch (error) {
          console.log('AsyncStorage Error: ' + error.message);
        }
    }
};

export default deviceStorage;