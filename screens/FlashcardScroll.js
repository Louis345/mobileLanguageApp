import React, { Component } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback
} from "react-native";
import AsyncStorage from "../util/fetchData";
import withNavigationContextConsumer from "../context/with-navigation-context-consumer";
import Speech from "../components/HOC/Speech";
const SCREEN_WIDTH = Dimensions.get("window").width;
let xOffset = new Animated.Value(0);
let counter = null;
import { MaterialIcons } from "@expo/vector-icons";
import { summerSky } from "../styles/styles";
class CardScroll extends Component {
  constructor(props) {
    super(props);
    const flashcards = [];
    this.state = {
      flashcards,
      flipping: false,
      count: 0,
      showModal: false
    };

    this.flipValue = new Animated.Value(0);

    this.frontAnimatedStyle = {
      transform: [
        {
          rotateY: this.flipValue.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "180deg"]
          })
        }
      ]
    };

    this.backAnimatedStyle = {
      transform: [
        {
          rotateY: this.flipValue.interpolate({
            inputRange: [0, 1],
            outputRange: ["180deg", "360deg"]
          })
        }
      ]
    };
  }

  async componentDidMount() {
    xOffset = new Animated.Value(0);
    this.currentlyViewedCard = 0;
    const { selectedCardDeck } = this.props;

    const cards = AsyncStorage.getDeckList(selectedCardDeck);
    cards.then(cards => {
      this.setState({
        flipped: this.state.flashcards.map(() => false),
        deckLength: this.state.flashcards.length,
        flashcards: cards.flashcards
      });
    });

    this.onScroll = Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: { x: xOffset }
          }
        }
      ],

      {
        useNativeDriver: false
      }
    );
  }

  async componentDidUpdate(prevProps) {
    if (this.props.selectedCardDeck !== prevProps.selectedCardDeck) {
      const { selectedCardDeck } = this.props;
      this.flipValue.setValue(0);

      const cards = AsyncStorage.getDeckList(selectedCardDeck);
      cards.then(cards => {
        this.setState({
          flipped: this.state.flashcards.map(() => false),
          deckLength: this.state.flashcards.length,
          flashcards: cards.flashcards
        });
      });
    }
  }

  renderCard = (card, index) => {
    const { flashcards } = this.state;

    flashcards &&
      (this.transitionAnimations = flashcards.map((card, index) => ({
        transform: [
          { perspective: 800 },
          {
            scale: xOffset.interpolate({
              inputRange: [
                (index - 1) * SCREEN_WIDTH,
                index * SCREEN_WIDTH,
                (index + 1) * SCREEN_WIDTH
              ],
              outputRange: [0.25, 1, 0.25]
            })
          },
          {
            rotateX: xOffset.interpolate({
              inputRange: [
                (index - 1) * SCREEN_WIDTH,
                index * SCREEN_WIDTH,
                (index + 1) * SCREEN_WIDTH
              ],
              outputRange: ["45deg", "0deg", "45deg"]
            })
          },
          {
            rotateY: xOffset.interpolate({
              inputRange: [
                (index - 1) * SCREEN_WIDTH,
                index * SCREEN_WIDTH,
                (index + 1) * SCREEN_WIDTH
              ],
              outputRange: ["-45deg", "0deg", "45deg"]
            })
          }
        ]
      })));

    if (this.state.flipped) {
      const isFlipped = this.state.flipped[index];
      return (
        <View style={styles.container} key={index}>
          <View style={styles.scrollPage}>
            <TouchableWithoutFeedback
              onPress={() => {
                card.isCardFlipped = !card.isCardFlipped;
                console.log(card);
                this.flipCard(index);
              }}
            >
              <View>
                {(this.state.flipping || !isFlipped) && (
                  <Animated.View
                    style={[
                      this.state.flipping
                        ? this.frontAnimatedStyle
                        : this.transitionAnimations[index],
                      styles.screen
                    ]}
                  >
                    <Text style={[styles.text]}>{flashcards[index].front}</Text>
                  </Animated.View>
                )}

                {(this.state.flipping || isFlipped) && (
                  <Animated.View
                    style={[
                      styles.screen,
                      this.state.flipping
                        ? this.backAnimatedStyle
                        : this.transitionAnimations[index],
                      this.state.flipping && styles.back
                    ]}
                  >
                    <Text style={styles.text}>{flashcards[index].back}</Text>
                  </Animated.View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      );
    }
  };

  flipCard = index => {
    if (this.state.flipping) return;

    let isFlipped = this.state.flipped[index];
    let flipped = [...this.state.flipped];
    flipped[index] = !isFlipped;

    this.setState(
      {
        flipping: true,
        flipped
      },
      () => {
        this.flipValue.setValue(isFlipped ? 1 : 0);
        Animated.timing(this.flipValue, {
          toValue: isFlipped ? 0 : 1,
          friction: 200,
          tension: 10
        }).start(() => {
          this.setState({ flipping: false });
        });
      }
    );
  };

  render() {
    const { flashcards } = this.state;

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback
          onPress={async () => {
            const response = await this.props.createWord(
              !flashcards[this.currentlyViewedCard].isCardFlipped
                ? flashcards[this.currentlyViewedCard].front
                : flashcards[this.currentlyViewedCard].back
            );
            if (response) this.props.speak();
          }}
        >
          <MaterialIcons
            name="play-circle-outline"
            size={30}
            color={summerSky}
          />
        </TouchableWithoutFeedback>
        <Animated.ScrollView
          scrollEnabled={!this.state.flipping}
          scrollEventThrottle={16}
          onScroll={this.onScroll}
          horizontal
          pagingEnabled
          style={styles.scrollView}
          ref={ref => (this.scrollView = ref)}
          onMomentumScrollEnd={(event, index) => {
            // scroll animation ended
            const currentOffset = event.nativeEvent.contentOffset.x;
            const dif = currentOffset - (this.offset || 0);

            if (Math.abs(dif) < 3) {
            } else if (dif < 0) {
              this.currentlyViewedCard = this.currentlyViewedCard - 1;
            } else {
              this.currentlyViewedCard = this.currentlyViewedCard + 1;
            }
            console.log(this.currentlyViewedCard);
            this.offset = currentOffset;
          }}
        >
          {flashcards && flashcards.map(this.renderCard)}
        </Animated.ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  scrollView: {
    flexDirection: "row",
    backgroundColor: "black"
  },

  scrollPage: {
    width: SCREEN_WIDTH,
    padding: 20
  },
  screen: {
    height: 400,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "white",
    width: SCREEN_WIDTH - 20 * 2,
    backfaceVisibility: "hidden"
  },
  text: {
    fontSize: 45,
    fontWeight: "bold"
  },
  iconStyle: {
    flexDirection: "row",
    justifyContent: "center"
  },
  back: {
    position: "absolute",
    top: 0,
    backfaceVisibility: "hidden"
  }
});

const FlashcardScroll = Speech(withNavigationContextConsumer(CardScroll));

export default FlashcardScroll;
