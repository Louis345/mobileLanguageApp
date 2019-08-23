import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Keyboard
} from 'react-native';
import Card from '../components/Card/Card';
import ActionSheet from '../components/ActionSheet/ActionSheet';
import { lightBlue, cardWidth, cardMargin } from '../styles/styles';
import { Input, Button } from 'react-native-elements';
import { Entypo } from '@expo/vector-icons';

const cardWithPadding = cardWidth + cardMargin * 2;
export default class CreateCard extends React.Component {
  constructor() {
    super();
    this.cardPosition = [];
  }
  state = {
    isPanelOpen: false,
    flipCard: false,
    flashcards: [
      {
        isCardFlipped: false,
        front: '',
        back: ''
      }
    ],
    flashcardsPosition: [],
    fixedFlashcardPosition: [],
    offset: {},
    currentlyViewedCard: 0,
    isCardFlipped: false,
    userInput: '',
    scrollToCard: null
  };

  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction();
    });
  }
  componentWillUnmount() {
    this.focusListener.remove();
  }

  onFocusFunction = async () => {
    const {
      navigation: {
        state: { params, params: flashcards }
      }
    } = this.props;
    if (flashcards) {
      this.setState(
        {
          flashcards: flashcards.flashcards
        },
        () => {
          this.scrollToCard();
        }
      );
    }
    if (params) {
      setTimeout(() => {
        this.scrollToCard();
      }, 500);
    }
  };

  handleTitleChange = title => {
    this.setState({
      title
    });
  };

  handleNewCard = () => {
    const { flashcards } = this.state;
    const newFlashCards = [...this.state.flashcards];
    newFlashCards.push({
      isCardFlipped: false,
      front: '',
      back: ''
    });
    this.setState(
      {
        flashcards: newFlashCards
      },
      () => {
        this.scroller.getNode().scrollTo({
          x: flashcards.length * cardWithPadding,
          y: 0,
          animated: true
        });
      }
    );
  };

  setFlashcardPositions = flashcardsPosition => {
    let placeHolder = 0;

    const updatedArr = flashcardsPosition.map((position, index) => {
      if (position === 0) {
        return 0;
      } else {
        placeHolder += cardWithPadding;
        return placeHolder;
      }
    });

    return updatedArr;
  };

  handleLayoutChange(event, index) {
    this.feedPost.measure((fx, fy, width, height, px, py) => {
      const newFlashCardPosition = [...this.state.flashcardsPosition];

      newFlashCardPosition.push(fx);

      this.setState({
        flashcardsPosition: [...newFlashCardPosition],
        currentlyViewedCard: index
      });
    });
  }

  handleInputChange = userInput => {
    this.setState({
      userInput
    });
  };

  handleOnScrollEndDrag = (targetContentOffset, event) => {
    const { flashcardsPosition } = this.state;

    const cardPosition = Math.round(targetContentOffset / cardWithPadding);
    const cardNumber =
      Number.isNaN(cardPosition) || cardPosition >= flashcardsPosition.length
        ? flashcardsPosition.length - 1
        : cardPosition;

    this.setState({
      cardNumber,
      currentlyViewedCard: cardNumber
    });
  };

  handleCardFlip = () => {
    const { flashcards, currentlyViewedCard } = this.state;
    const updatedCards = flashcards.map((flashcard, index) => {
      if (currentlyViewedCard === index) {
        flashcard.isCardFlipped = !flashcard.isCardFlipped;
      }
      return flashcard;
    });

    this.setState({
      flashcards: updatedCards,
      isCardFlipped: !this.state.isCardFlipped
    });
  };

  handleOnSave = cardFacingPosition => {
    const { flashcards, currentlyViewedCard, userInput } = this.state;
    const updatedCards = flashcards.map((flashcard, index) => {
      if (currentlyViewedCard === index) {
        flashcard[cardFacingPosition] = userInput;
      }
      return flashcard;
    });
    this.setState(
      {
        flashcards: updatedCards,
        userInput: ''
      },
      () => {
        Keyboard.dismiss();
      }
    );
  };

  handleDeleteCard = () => {
    const { flashcards, currentlyViewedCard, flashcardsPosition } = this.state;

    let lastDeletedCardIndex = null;

    const updatedCard = flashcards.filter((flashcard, index) => {
      if (currentlyViewedCard != index) {
        return flashcards;
      } else {
        lastDeletedCardIndex = index;
      }
    });

    const updatedFlashcardPosition = flashcardsPosition.filter(
      (position, index) => {
        if (index !== lastDeletedCardIndex) {
          return position;
        } else {
          removedFlascardPosition = position;
        }
      }
    );

    updatedFlashcardPosition.unshift(0);

    const fixedArrayPositions = this.setFlashcardPositions(
      updatedFlashcardPosition
    );

    this.scroller.getNode().scrollTo({
      x:
        fixedArrayPositions[
          currentlyViewedCard === 0
            ? currentlyViewedCard
            : currentlyViewedCard - 1
        ],
      y: 0,
      animated: true
    });

    this.setState({
      flashcards: updatedCard,
      currentlyViewedCard:
        currentlyViewedCard === 0
          ? currentlyViewedCard
          : currentlyViewedCard - 1,
      flashcardsPosition: fixedArrayPositions
    });
  };

  scrollToCard = () => {
    const {
      navigation: {
        state: {
          params: { scrollToCard }
        }
      }
    } = this.props;
    const { flashcardsPosition } = this.state;

    const updatedFlashcardPosition = this.setFlashcardPositions(
      flashcardsPosition
    );
    this.scroller.getNode().scrollTo({
      x: updatedFlashcardPosition[scrollToCard],
      y: 0,
      animated: true
    });
    this.setState({
      currentlyViewedCard: scrollToCard
    });
  };

  render() {
    const actionSheetHeight = {
      top:
        Dimensions.get('window').height -
        Dimensions.get('window').height * -0.05
    };
    const { flashcards, currentlyViewedCard, userInput } = this.state;
    const { navigation } = this.props;

    if (flashcards[currentlyViewedCard]) {
      cardFacingPosition = flashcards[currentlyViewedCard].isCardFlipped
        ? 'back'
        : 'front';
    } else {
      cardFacingPosition = flashcards[currentlyViewedCard - 1].isCardFlipped
        ? 'back'
        : 'front';
    }

    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() =>
              flashcards.length === 1
                ? navigation.navigate('CreateDeck')
                : this.handleDeleteCard()
            }
          >
            <Text style={styles.headerText}>Delete Card</Text>
          </TouchableOpacity>
          <View>
            <Text>{`${
              currentlyViewedCard > flashcards.length
                ? currentlyViewedCard - 1
                : currentlyViewedCard + 1
            } - ${cardFacingPosition}`}</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('CreateDeck', {
                flashcards: [...this.state.flashcards]
              })
            }
          >
            <Text style={styles.headerText}>Done</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bodyContainer}>
          <Animated.ScrollView
            horizontal
            decelerationRate={0}
            contentContainerStyle={styles.contentContainer}
            ref={scroller => {
              this.scroller = scroller;
            }}
            snapToAlignment={'center'}
            snapToInterval={cardWithPadding}
            contentInset={{
              top: 0,
              left: 0,
              bottom: 0,
              right: -cardWidth * 0.7
            }}
            onScrollEndDrag={event => {
              if (event.nativeEvent) {
                this.handleOnScrollEndDrag(
                  event.nativeEvent.targetContentOffset.x,
                  event
                );
              }
            }}
            scrollEventThrottle={16}
          >
            {flashcards.map((flashcard, index) => {
              return (
                <View
                  style={styles.contentContainer}
                  onLayout={event => {
                    this.handleLayoutChange(event, index);
                  }}
                  ref={view => {
                    this.feedPost = view;
                  }}
                  key={index}
                >
                  <TouchableOpacity
                    onPress={() => this.setState({ isPanelOpen: true })}
                  >
                    <Card
                      flipToSideA={
                        index === currentlyViewedCard &&
                        flashcard &&
                        flashcard.isCardFlipped &&
                        flashcard.isCardFlipped
                      }
                      flipToSideB={
                        index === currentlyViewedCard &&
                        flashcard &&
                        !flashcard.isCardFlipped &&
                        !flashcard.isCardFlipped
                      }
                      width={cardWidth}
                      style={{
                        height: 250,
                        borderRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                      SideB={
                        flashcard.back === '' ? 'Enter Text' : flashcard.back
                      }
                    >
                      <View>
                        <Text>
                          {flashcard.front === ''
                            ? 'Enter Text'
                            : flashcard.front}
                        </Text>
                      </View>
                    </Card>
                  </TouchableOpacity>
                </View>
              );
            })}
            <TouchableOpacity onPress={() => this.handleNewCard()}>
              <Card
                style={styles.placeHolder}
                width={cardWidth}
                style={{ height: 250, ...styles.placeHolder }}
              >
                <Entypo name="plus" color={lightBlue} size={35} />
              </Card>
            </TouchableOpacity>
          </Animated.ScrollView>
        </View>
        <Button title={'Flip'} small onPress={() => this.handleCardFlip()} />
        <ActionSheet
          animatePanel={this.state.isPanelOpen}
          height={actionSheetHeight}
          input={this}
        >
          <View style={[styles.createTitle]}>
            <View style={[styles.header, styles.center]}>
              <Text style={[styles.headerButtonText, { marginRight: 'auto' }]}>
                Edit Front
              </Text>
              <TouchableOpacity
                onPress={() =>
                  this.setState(
                    {
                      isPanelOpen: false,
                      isInputFocused: false
                    },
                    () => {
                      userInput.length > 0 &&
                        this.handleOnSave(cardFacingPosition);
                    }
                  )
                }
              >
                <Text style={[styles.headerButtonText]}>Done</Text>
              </TouchableOpacity>
            </View>

            <Input
              placeholder="Type something"
              onChangeText={this.handleInputChange}
              defaultValue={
                flashcards[currentlyViewedCard] &&
                flashcards[currentlyViewedCard][cardFacingPosition]
              }
              ref={ref => {
                this.FirstInput = ref;
              }}
              multiline={true}
              numberOfLines={4}
            />
          </View>
        </ActionSheet>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  headerText: {
    color: lightBlue,
    fontWeight: 'bold'
  },
  bodyContainer: {
    alignItems: 'center'
  },
  placeHolder: {
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  center: {
    textAlign: 'center',
    justifyContent: 'center'
  },
  headerButtonText: {
    color: lightBlue,
    fontSize: 20,
    fontWeight: 'bold'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    margin: 10
  },
  contentContainer: {
    flexDirection: 'row'
  }
});
