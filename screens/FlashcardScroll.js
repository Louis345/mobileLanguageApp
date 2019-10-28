import React, { Component } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  PickerIOS
} from "react-native";
import QuickPicker from "quick-picker";
import Touchable from "@appandflow/touchable";
import AsyncStorage from "../util/fetchData";
import withNavigationContextConsumer from "../context/with-navigation-context-consumer";
import { FloatingAction } from "react-native-floating-action";
import Speech from "../components/HOC/Speech";
const SCREEN_WIDTH = Dimensions.get("window").width;
let xOffset = new Animated.Value(0);
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { summerSky } from "../styles/styles";
import ActionSheet from "../components/ActionSheet/ActionSheet";
import { Input, Button } from "react-native-elements";
import axios from "axios";
import fetchData from "../util/fetchData";

const actions = [
  {
    text: "Translate",
    icon: <MaterialIcons name="translate" size={30} color={summerSky} />,
    name: "translate",
    position: 2
  }
];

class CardScroll extends Component {
  constructor(props) {
    super(props);
    const flashcards = [];
    this.state = {
      flashcards,
      flipping: false,
      count: 0,
      showModal: false,
      isPanelOpen: false,
      isFlipped: false,
      targetLanguage: null,
      hasWordBeenTranslated: false
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
      console.log(cards);
      this.setState({
        flipped: this.state.flashcards.map(() => false),
        deckLength: this.state.flashcards.length,
        flashcards: cards.flashcards,
        date: cards.date
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
        flipped,
        isFlipped
      },
      () => {
        console.log({ isFlipped });
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

  handleTranslation = async () => {
    const { hasWordBeenTranslated, currentlyViewedCard } = this.state;
    console.log("handle Translation");
    console.log({ currentlyViewedCard });
    const translationPromise = await axios.post(
      "http://ec2-3-89-189-253.compute-1.amazonaws.com/translate",
      { text: currentlyViewedCard, target: this.state.targetLanguage }
    );

    console.log({ translationPromise });
    this.setState({
      translatedWord: translationPromise.data[0],
      hasWordBeenTranslated: true
    });
  };

  handleLanguageDetection = async () => {
    const { currentlyViewedCard } = this.state;
    const detectionPromise = await axios.post(
      "http://ec2-3-89-189-253.compute-1.amazonaws.com/languageDetection",
      { text: currentlyViewedCard }
    );
    console.log({ detectionPromise });
    this.setState({
      detectedLanguage: detectionPromise.data[0]
    });
  };

  openDropDown = () => {
    QuickPicker.open({
      items: ["", "ja", "en"],
      selectedValue: " ", // this could be this.state.selectedLetter as well.
      onValueChange: selectedValueFromPicker => {
        console.log({ selectedValueFromPicker });
        this.setState({ targetLanguage: selectedValueFromPicker });
      }
    });
  };

  upDateCard = async () => {
    const {
      flashcards,
      currentlyViewedCard,
      flipping,
      translatedWord,
      date,
      hasWordBeenTranslated
    } = this.state;

    const sideOfFlashcard = !flipping ? "front" : "back";

    const updatedFlashcardDeck = flashcards.map((flashcard, index) => {
      if (flashcard[sideOfFlashcard] === currentlyViewedCard) {
        flashcard[
          sideOfFlashcard === "front" ? "back" : "front"
        ] = translatedWord;
      }
      return flashcard;
    });

    const response = await AsyncStorage.setDeck(
      this.props.selectedCardDeck,
      date,
      updatedFlashcardDeck
    );

    this.setState({
      isPanelOpen: false,
      hasWordBeenTranslated: false
    });
  };

  render() {
    const { flashcards, targetLanguage, hasWordBeenTranslated } = this.state;
    let currentlyViewedCard = null;
    const actionSheetHeight = {
      top:
        Dimensions.get("window").height -
        Dimensions.get("window").height * -0.05
    };

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback
          onPress={async () => {
            if (flashcards.length > 1) {
              currentlyViewedCard = !this.state.flipped[
                this.currentlyViewedCard
              ]
                ? flashcards[this.currentlyViewedCard].front
                : flashcards[this.currentlyViewedCard].back;
            }

            const response = await this.props.createWord(currentlyViewedCard);
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
            this.offset = currentOffset;
          }}
        >
          {flashcards && flashcards.map(this.renderCard)}
        </Animated.ScrollView>
        <FloatingAction
          actions={actions}
          onPressItem={name => {
            if (flashcards.length > 1) {
              currentlyViewedCard = !this.state.flipped[
                this.currentlyViewedCard
              ]
                ? flashcards[this.currentlyViewedCard].front
                : flashcards[this.currentlyViewedCard].back;
            }

            this.setState(
              {
                isPanelOpen: !this.state.isPanelOpen,
                currentlyViewedCard
              },
              () => this.handleLanguageDetection()
            );
          }}
        />
        <ActionSheet
          animatePanel={this.state.isPanelOpen}
          height={actionSheetHeight}
        >
          <View
            style={{ flex: 1, marginTop: 5, marginLeft: 5, marginRight: 5 }}
          >
            <View style={styles.translateHeader}>
              <Text>{this.state.detectedLanguage} - detected</Text>
              <AntDesign name="swap" size={30} color={summerSky} />
              <Touchable
                feedback="opacity"
                native={false}
                onPress={this.openDropDown}
                style={{ flexDirection: "row" }}
              >
                <Text>
                  {targetLanguage === null ? "Language" : targetLanguage}
                </Text>
                <AntDesign name="caretdown" size={14} color={summerSky} />
              </Touchable>
            </View>
            <View style={styles.inputContainer}>
              <View style={{ flex: 0.5 }}>
                <Input
                  placeholder="Enter deck title"
                  onChangeText={this.handleTitleChange}
                  ref={ref => {
                    this.FirstInput = ref;
                  }}
                  defaultValue={this.state.currentlyViewedCard}
                />
              </View>
              <View style={{ flex: 0.5 }}>
                <Input
                  placeholder="Enter Word"
                  onChangeText={this.handleTitleChange}
                  ref={ref => {
                    this.FirstInput = ref;
                  }}
                  defaultValue={this.state.translatedWord}
                  style={{
                    borderRadius: 4,
                    borderBottomWidth: 0.5,
                    borderColor: "#fff"
                  }}
                />
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title={hasWordBeenTranslated ? "Update Card" : "Translate Card"}
                onPress={() =>
                  hasWordBeenTranslated
                    ? this.upDateCard()
                    : this.handleTranslation()
                }
              />
              <Button
                title="Cancel"
                onPress={() =>
                  this.setState({
                    isPanelOpen: false,
                    currentlyViewedCard: !this.state.flipped[
                      this.currentlyViewedCard
                    ]
                      ? flashcards[this.currentlyViewedCard].front
                      : flashcards[this.currentlyViewedCard].back
                  })
                }
                style={{ marginTop: 10 }}
              />
            </View>
          </View>
        </ActionSheet>
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
  translateHeader: {
    width: "100%",
    flex: 0.07,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around"
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
  inputContainer: {
    borderColor: "#d6d7da",
    flexDirection: "row"
  },
  buttonContainer: {
    flexDirection: "column",
    flex: 1,
    marginTop: 20,
    padding: 20
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
