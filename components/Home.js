import React from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import SwipeView from './SwipeView'
import config from '../config'


export default class Home extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      swipeView: false,
    }

    this.onPressButton = this.onPressButton.bind(this)
  }

  onPressButton = () => {
    this.setState(
      Object.assign({}, this.state, {
        swipeView: true,
      }
      ))
  }


  render() {
    if (!this.state.swipeView) {
      return (
        <View style={styles.container}>
        <Text style={styles.textTitle}>Meal Swipe</Text>
        <Text></Text><Text></Text><Text></Text><Text></Text>
          <Text style={styles.text}>Don't know where to eat?</Text>
          <View style={styles.buttonContainer}>
            <Button
              onPress={this.onPressButton}
              title="Start swiping! "
              color='white'
            />
          </View>
        </View>
      );
    } else {
      return (
        <SwipeView firstTime={true} />
      )
    }
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'maroon',
    fontSize: 30,
    textAlign: 'center'
  },
  textTitle: {
    color: 'maroon',
    fontWeight: 'bold',
    fontSize: 40,
    textAlign: 'center',
    borderRadius: 10,
    margin: 20,
    padding: 10,
    borderColor: 'maroon',
    borderWidth: 1
  },

  buttonContainer: {
    backgroundColor: 'maroon',
    borderRadius: 10,
    margin: 20,
    padding: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 10,
    shadowOpacity: 0.25,
  }
});
