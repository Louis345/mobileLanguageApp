import React from "react";
import {
  SafeAreaView,
  Text,
  Animated,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  ScrollView
} from "react-native";
import withNavigationContextConsumer from "../context/with-navigation-context-consumer";

const { width, height } = Dimensions.get("window");
import Card from "../components/Card/Card";
import AsyncStorage from "../util/fetchData";
import { lightBlue } from "../styles/styles";
const yourDeckXOffset = new Animated.Value(0);
const favoritesXOffset = new Animated.Value(0);

class DeckMenu extends React.PureComponent {
  state = {
    deckList: []
  };
  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      this.onFocusFunction();
    });
  }

  onFocusFunction = async () => {
    const deckList = await AsyncStorage.getAllDecks();
    this.setState({
      deckList
    });
  };

  componentWillUnmount() {
    this.focusListener.remove();
  }
  render() {
    const { deckList } = this.state;
    if (deckList.length > 0) {
      deckList.sort((a, b) => {
        return a.date + b.date;
      });
    }

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
          <ScrollView
            ref={scrollView => {
              this.scrollView = scrollView;
            }}
            style={styles.container}
            horizontal={true}
            decelerationRate={0}
            snapToInterval={width - 160}
            snapToAlignment={"center"}
            contentInset={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 30
            }}
          >
            {deckList.map((deck, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    this.props.setSelectedCardDeck(
                      deck.title,
                      deck.flashcards.length
                    );
                    this.props.navigation.navigate("Cards");
                  }}
                >
                  <View>
                    <Card
                      title={deck.title}
                      position={index}
                      xOffset={yourDeckXOffset}
                      style={{
                        width: width - 200,
                        margin: 10,
                        height: 125,
                        borderRadius: 10
                      }}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <View style={styles.menuContainer}>
            <Text style={styles.menuLink}>Favorites</Text>
            <Text style={styles.menuLink}>See All</Text>
          </View>
          <ScrollView
            ref={scrollView => {
              this.scrollView = scrollView;
            }}
            style={styles.container}
            horizontal={true}
            decelerationRate={0}
            snapToInterval={width - 160}
            snapToAlignment={"center"}
            contentInset={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 30
            }}
          >
            {deckList.length > 0 ? (
              deckList.map((deck, index) => {
                return (
                  <View key={index}>
                    <Card
                      title={deck.title}
                      position={index}
                      xOffset={favoritesXOffset}
                      style={{
                        width: width - 200,
                        margin: 10,
                        height: 125,
                        borderRadius: 10
                      }}
                    />
                  </View>
                );
              })
            ) : (
              <ActivityIndicator size="large" color="#0000ff" />
            )}
          </ScrollView>
        </Animated.ScrollView>
      </SafeAreaView>
    );
  }
}
const Menu = withNavigationContextConsumer(DeckMenu);

export default Menu;
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  menuContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  headerContainer: {
    backgroundColor: lightBlue,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
    minHeight: height * 0.25
  },
  menuLink: {
    color: lightBlue,
    fontSize: 15,
    fontWeight: "bold",
    margin: 10
  },
  headerTitle: {
    justifyContent: "center",
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#d6d7da",
    marginTop: 10
  },
  decksToReview: {
    color: "#fff",
    marginRight: 10,
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold"
  }
});
