import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  Animated,
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { lightBlue } from '../styles/styles';
import Card from '../components/Card/Card';
import Decks from '../components/Card/card-fixture';
import { onScroll } from '../util/animationHelper';

const yourDeckXOffset = new Animated.Value(0);
const favoritesXOffset = new Animated.Value(0);

const Menu = props => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.decksToReview}>Decks To Review</Text>
      </View>
      <Animated.ScrollView>
        <View style={styles.menuContainer}>
          <Text style={styles.menuLink}>Your Deck</Text>
          <Text style={styles.menuLink}>See All</Text>
        </View>
        <Animated.ScrollView
          scrollEventThrottle={16}
          onScroll={onScroll(yourDeckXOffset)}
          horizontal
          pagingEnabled
          style={styles.scrollView}
        >
          {Decks.map((Deck, index) => {
            return (
              <TouchableOpacity
                onPress={() => props.navigation.navigate('LessonsMenu')}
              >
                <View key={index}>
                  <Card
                    title={Deck.title}
                    position={index}
                    xOffset={yourDeckXOffset}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </Animated.ScrollView>
        <View style={styles.menuContainer}>
          <Text style={styles.menuLink}>Favorites</Text>
          <Text style={styles.menuLink}>See All</Text>
        </View>
        <Animated.ScrollView
          horizontal
          onScroll={onScroll(favoritesXOffset)}
          scrollEventThrottle={16}
        >
          {Decks.map((Deck, index) => {
            return (
              <View key={index}>
                <Card
                  title={Deck.title}
                  position={index}
                  xOffset={favoritesXOffset}
                />
              </View>
            );
          })}
        </Animated.ScrollView>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headerContainer: {
    backgroundColor: lightBlue,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flex: 1.2,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  menuLink: {
    color: lightBlue,
    fontSize: 15,
    fontWeight: 'bold',
    margin: 10
  },
  headerTitle: {
    justifyContent: 'center',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    marginTop: 10
  },
  decksToReview: {
    color: '#fff',
    marginRight: 10,
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold'
  }
});

export default Menu;
