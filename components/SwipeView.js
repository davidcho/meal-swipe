import React from 'react';
import { StyleSheet, Image, Button, View, Text, Alert } from 'react-native';
import SwipeCards from 'react-native-swipe-cards';
import Home from './Home'
import Recommended from './Recommended'
import config from '../config'


class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={[styles.card, { backgroundColor: this.props.backgroundColor }]}>
        <Image
          style={styles.card}
          source={{ uri: this.props.url }}
        />
      </View>
    )
  }
}

class NoMoreCards extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      swipeView: true,
    };
    this.onPressHome = this.onPressHome.bind(this)
  }

  onPressHome = () => {
    this.setState({
      swipeView: false
    })
  }

  render() {
    if (this.state.swipeView) {
      return (
        <View>
          <Text style={styles.text}>No more pictures :(</Text>
          <View style={styles.buttonContainer}>
            <Button
              onPress={this.onPressHome}
              title="Try again!"
              color='white'
            />
          </View>
        </View>
      )
    } else {
      return (
        <Home />
      )
    }
  }
}

export default class SwipeView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listOfRestaurantPics: [],
      swipeView: true,
      restaurantsLiked: {},
      recommend: false,
      recommendRest: "",
      firstTime: this.props.firstTime,
      latitude: "",
      longitude: ""
    };
    this.handleYup = this.handleYup.bind(this)
    this.handleNope = this.handleNope.bind(this)

  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position)
        let latitude = position.coords.latitude
        let longitude = position.coords.longitude
        let restaurantPics = []
        let key = config.MY_KEY
        fetch('https://api.yelp.com/v3/businesses/search?term=restaurants&sort_by=rating&latitude=' + latitude + '&longitude=' + longitude + '&radius=1600&limit=30', {
        method: 'GET',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: key
        }
        })
      .then((response) => response.json())
      .then((responseJson) => {
        let responseJsonRandom = responseJson["businesses"].slice()
        for (var i = responseJsonRandom.length - 1; i > 0; i-- ) {
          let j = Math.floor(Math.random() * (i + 1));
          [responseJsonRandom[i], responseJsonRandom[j]] = [responseJsonRandom[j], responseJsonRandom[i]];
        }

        let responseJsonRandomFetch = responseJsonRandom.slice()
        responseJsonRandomFetch.forEach(rest => {
          fetch(('https://api.yelp.com/v3/businesses/' + rest.id), {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: key
            }
          })
            .then((response) => response.json())
            .then((responseJson) => {
              if (responseJson["photos"]) {
                for (var i = 0; i < responseJson["photos"].length; i++) {
                  restaurantPics.push({
                    url: responseJson["photos"][i],
                    rest: responseJson["id"]
                  });
                  let listOfPics = restaurantPics.slice()
                  for (let i = listOfPics.length - 1; i > 0; i--) {
                    let j = Math.floor(Math.random() * (i + 1));
                    [listOfPics[i], listOfPics[j]] = [listOfPics[j], listOfPics[i]];
                  }
                  this.setState({ listOfRestaurantPics: listOfPics });
                }
              }
            });
        });
      });
    });
  }

  handleYup(card) {
    if (this.state.restaurantsLiked[card.rest]) {
      restName = card.rest.split("-").join(" ")
      restName = restName.slice(0, restName.length - 10)
      this.setState({
        recommend: true,
        recommendRest: card.rest,
      })
    } else {
      this.state.restaurantsLiked[card.rest] = 'liked'
      let newListOfPics = this.state.listOfRestaurantPics.slice()
      newListOfPics = newListOfPics.filter(function (obj) {
        return obj.url !== card.url;
      });
      this.setState(Object.assign({}, this.state, { firstTime: false, listOfRestaurantPics: newListOfPics }))
      this.state.firstTime = false
    }
  }
  handleNope(card) {
    let newListOfPics = this.state.listOfRestaurantPics.slice()
    newListOfPics = newListOfPics.filter(function (obj) {
      return obj.url !== card.url;
    });
    this.setState(Object.assign({}, this.state, { firstTime: false, listOfRestaurantPics: newListOfPics }))
    this.state.firstTime = false
  }

  render() {
    let pictures = this.state.listOfRestaurantPics
    if (this.state.swipeView & !this.state.recommend && !this.state.firstTime) {
      return (
        <View style={styles.container}>
          {this.state && this.state.listOfRestaurantPics.length ?
            <View style={styles.container}>
              <SwipeCards
                cards={this.state.listOfRestaurantPics}
                renderCard={(cardData) => <Card {...cardData} />}
                renderNoMoreCards={() => <NoMoreCards />}
                handleYup={this.handleYup}
                handleNope={this.handleNope}
              />
            </View>
            :
            <Text style={styles.text}>Loading...</Text>
          }
        </View>
      )
    } else if (!this.state.recommend && this.state.firstTime) {
      return (
        <View style={styles.container}>
          {this.state && this.state.listOfRestaurantPics.length ?
            <View>
              <View>
                <Text style={styles.textRight}>  Swipe right to like ⟶</Text>
                <SwipeCards
                  cards={this.state.listOfRestaurantPics}
                  renderCard={(cardData) => <Card {...cardData} />}
                  renderNoMoreCards={() => <NoMoreCards />}
                  handleYup={this.handleYup}
                  handleNope={this.handleNope}
                />
                <Text style={styles.textLeft}>⟵ Swipe left to not   </Text>
              </View>
            </View>
            :
            <Text style={styles.text}>Fetching nearby food...</Text>
          }
        </View>
      )
    } else if (this.state.recommend) {
      return (
        <Recommended props={this.state.recommendRest} list={this.state.listOfRest} />
      )
    } else {
      return (
        <Text>
          Loading
        </Text>
      )
    }
  }
}

const styles = StyleSheet.create({
  card: {
    width: 350,
    height: 350,
    margin: 0
  },
  noMoreCardsText: {
    fontSize: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
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
    }
  },
  text: {
    color: 'maroon',
    fontWeight: 'bold',
    fontSize: 30,
  },
  textRight: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 30,
    position: 'absolute',
    top: 90,
    borderRadius: 5,
    right: 0,
  },
  textLeft: {
    color: '#d9534f',
    fontWeight: 'bold',
    fontSize: 30,
    position: 'absolute',
    bottom: 90,
    borderRadius: 5,
    left: 0,
  }
})

