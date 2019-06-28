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
import { lightBlue, cardWidth } from '../styles/styles';
import { Input, Button } from 'react-native-elements';
import { Entypo } from '@expo/vector-icons';
import { cardMargin } from '../styles/styles';
const SCREEN_WIDTH = Dimensions.get('window').width;

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
    minimumDifference: 0
  };
  handleNewCard = () => {
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
          x:
            (cardWidth + cardMargin * 2) * this.state.flashcardsPosition.length,
          y: 0,
          animated: true
        });
      }
    );
  };

  setArrayPositions = () => {
    const { flashcardsPosition } = this.state;
    let counter = 1;
    let mininumDifference = flashcardsPosition[1];
    let flaggedDifferenceIndex = null;
    let previous = null;
    let current = null;
    let next = null;

    flashcardsPosition.forEach((position, index) => {
      previous = flashcardsPosition[index - 1];
      current = flashcardsPosition[index];
      next = flashcardsPosition[index + 1];

      let difference = Math.floor(Math.abs(current - next));
      counter++;

      if (difference > mininumDifference) {
        flaggedDifferenceIndex = index;
      }
    });
    if (flaggedDifferenceIndex) {
      removedPositions = flashcardsPosition.slice(0, flaggedDifferenceIndex);

      let lengthDifference =
        flashcardsPosition.length - removedPositions.length;

      for (let i = 0; i < lengthDifference; i++) {
        removedPositions.push(
          removedPositions[removedPositions.length - 1] + mininumDifference
        );
      }
      return removedPositions;
    }
  };
  handleLayoutChange(event, index) {
    const {
      minimumDifference,
      currentlyViewedCard,
      removedFlascardPosition,
      fixedFlashcardPosition
    } = this.state;
    this.feedPost.measure((fx, fy, width, height, px, py) => {
      const newFlashCardPosition = [...this.state.flashcardsPosition];

      const fixedArrayPositions =
        newFlashCardPosition.length > 2 && this.setArrayPositions();

      removedFlascardPosition
        ? newFlashCardPosition.push(removedFlascardPosition)
        : newFlashCardPosition.push(fx);

      fixedArrayPositions &&
        fixedArrayPositions.length > 0 &&
        fixedArrayPositions.push(fx);

      this.setState({
        flashcardsPosition:
          fixedArrayPositions &&
          fixedArrayPositions.length > 0 &&
          newFlashCardPosition
            ? fixedArrayPositions.sort((a, b) => a - b)
            : newFlashCardPosition.sort((a, b) => a - b),
        currentlyViewedCard: index,
        removedFlascardPosition: null
      });
    });
  }

  handleInputChange = userInput => {
    this.setState({
      userInput
    });
  };

  handleOnScrollEndDrag = (targetContentOffset, event) => {
    const { flashcardsPosition, flashcards, currentlyViewedCard } = this.state;
    const cardPosition = Math.round(
      targetContentOffset / flashcardsPosition[1]
    );

    const cardNumber =
      Number.isNaN(cardPosition) || cardPosition >= flashcardsPosition.length
        ? flashcardsPosition.length - 1
        : cardPosition;

    this.setState({
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
    let removedFlascardPosition = null;
    const updatedCard = flashcards.filter((flashcard, index) => {
      if (currentlyViewedCard != index) {
        return flashcards;
      } else {
        lastDeletedCardIndex = index;
      }
    });
    const updatedFlashcardPosition = this.state.flashcardsPosition.filter(
      (position, index) => {
        if (index !== lastDeletedCardIndex) {
          return position;
        } else {
          removedFlascardPosition = position;
        }
      }
    );

    updatedFlashcardPosition.unshift(0);

    this.scroller.getNode().scrollTo({
      x: updatedFlashcardPosition[currentlyViewedCard - 1],
      y: 0,
      animated: true
    });

    this.setState({
      flashcards: updatedCard,
      currentlyViewedCard: lastDeletedCardIndex - 1,
      flashcardsPosition: updatedFlashcardPosition,
      removedFlascardPosition
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
    const cardFacingPosition = flashcards[
      currentlyViewedCard > flashcards.length
        ? currentlyViewedCard - 1
        : currentlyViewedCard
    ].isCardFlipped
      ? 'back'
      : 'front';
    console.log('currently viewed card', currentlyViewedCard);
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
            <Text>{`${currentlyViewedCard} - ${cardFacingPosition}`}</Text>
          </View>
          <View>
            <Text style={styles.headerText}>Done</Text>
          </View>
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
            snapToInterval={cardWidth + cardMargin * 2}
            contentInset={{
              top: 0,
              left: 0,
              bottom: 0,
              right: -cardWidth * 0.74
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
              console.log(flashcards[currentlyViewedCard][cardFacingPosition]);
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
                        flashcard.isCardFlipped &&
                        flashcard.isCardFlipped
                      }
                      flipToSideB={
                        index === currentlyViewedCard &&
                        !flashcard.isCardFlipped &&
                        !flashcard.isCardFlipped
                      }
                      width={cardWidth}
                      style={{
                        height: 250,
                        borderRadius: 20
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
