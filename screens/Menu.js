import React from 'react';
import {
  SafeAreaView,
  Text,
  Animated,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
import Card from '../components/Card/Card';
import { onScroll } from '../util/animationHelper';
import AsyncStorage from '../util/fetchData';
import { lightBlue, cardWidth, cardMargin } from '../styles/styles';
const yourDeckXOffset = new Animated.Value(0);
const favoritesXOffset = new Animated.Value(0);
const cardWithPadding = cardWidth + cardMargin * 2;
export default class Menu extends React.PureComponent {
  state = {
    deckList: []
  };
  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction();
    });
  }

  onFocusFunction = async () => {
    const deckList = await AsyncStorage.getDecks();
    this.setState({
      deckList
    });
  };

  componentWillUnmount() {
    this.focusListener.remove();
  }
  render() {
    const { deckList } = this.state;

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
            snapToAlignment={'center'}
            decelerationRate={0}
            snapToInterval={SCREEN_WIDTH / 2 - 60}
            contentInset={{
              top: 0,
              left: 30,
              bottom: 0,
              right: 30
            }}
          >
            {deckList.map((deckName, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    this.props.navigation.navigate('LessonsMenu', {
                      nameOfDeck: deckName
                    })
                  }
                >
                  <View>
                    <Card
                      title={deckName}
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
            snapToAlignment={'center'}
            snapToInterval={cardWithPadding}
            decelerationRate={0}
          >
            {deckList.length > 0 ? (
              deckList.map((deckName, index) => {
                return (
                  <View key={index}>
                    <Card
                      title={deckName}
                      position={index}
                      xOffset={favoritesXOffset}
                    />
                  </View>
                );
              })
            ) : (
              <ActivityIndicator size="large" color="#0000ff" />
            )}
          </Animated.ScrollView>
        </Animated.ScrollView>
      </SafeAreaView>
    );
  }
}

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
