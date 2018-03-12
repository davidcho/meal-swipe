import React from 'react';
import { StyleSheet, Text, View, Button, Image, Linking } from 'react-native';
import SwipeView from './SwipeView'
import Home from './Home'
import config from '../config'

export default class Recommended extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      recomendedRest: this.props.props,
      recommendedRestInfo: {},
      recommendedView: true,
      loadingText: 'Loading'
    }
    this.onPressSwipe = this.onPressSwipe.bind(this)
  }

  componentDidMount() {
    let key = config.MY_KEY
    fetch(('https://api.yelp.com/v3/businesses/' + this.state.recomendedRest), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: key
      }
    }).then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          recommendedRestInfo: responseJson
        })
      })
}

  onPressSwipe = () => {
    this.setState({recommendedView: false})
  }

  render() {
    let restName = this.state.recomendedRest
    restName = restName.split("-")
    let restNameNoCity = restName.slice(0, restName.length - 1).join(" ")
    let restNameUrl = restName.slice(0, restName.length - 2).join("+")
    
    if (this.state.recommendedView && this.state.recommendedRestInfo["image_url"]) {
      let restAddressUrl = (this.state.recommendedRestInfo["location"]["address1"]).split(" ").join("+")
      let restNameTitle = this.state.recommendedRestInfo["name"] + " (" + this.state.recommendedRestInfo["price"] + ")"
      let category = this.state.recommendedRestInfo["categories"][0]["title"].split("")
      category = category.filter(letter => {
        return (letter !== "(" &&   letter!== ")")
      })
      category = category.join("")
      let restCategory = "(" + category + ")"
      return (
        <View style={styles.container}>
        <Text style={styles.text}></Text><Text style={styles.text}></Text><Text style={styles.text}></Text>
          <Text style={styles.text}>We think you might like</Text>
          <View>
            <Image
            style={{width: 200, height: 200, margin: 10}}
            source={{ uri: this.state.recommendedRestInfo["image_url"] }} />
          </View>
          <Text style={styles.textDetail}>{restNameTitle}</Text>
          <Text style={styles.textDetail}>{restCategory}</Text>
          <Text style={styles.textSmall}>@</Text>        
          <Text style={styles.textSmallLink}
            onPress={() => Linking.openURL('https://www.google.com/maps/search/?api=1&query=' + restNameUrl + " " + restAddressUrl)}>
            {this.state.recommendedRestInfo["location"]["address1"]}
          </Text>
          <View style={styles.buttonContainer}>
            <Button
            onPress={() => Linking.openURL(this.state.recommendedRestInfo["url"])}
            title="Yelp this restaurant"
            color='white'
            />
          </View>
          <Text style={styles.text}></Text><Text style={styles.text}></Text><Text style={styles.text}></Text>
          <Text style={styles.textSmall}>Not feeling this?</Text>
          <View style={styles.buttonContainer}>
            <Button
            onPress={this.onPressSwipe}
            title="Swipe again!"
            color='white'
            />
          </View>
        </View>
      )
    } else if (this.state.recommendedView) {
      return (
        <View style={styles.container}>
          <Text style={styles.text}>Loading...</Text>
        </View>
      )
    } else {
      return (
        <SwipeView />
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
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSmall: {
    color: 'maroon',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSmallLink: {
    color: 'maroon',
    fontSize: 20,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    textDecorationLine: 'underline'
  },
  textDetail: {
    color: 'maroon',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
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
