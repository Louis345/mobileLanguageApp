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
import { lightBlue } from '../styles/styles';
import { Input, Button } from 'react-native-elements';
import { Entypo } from '@expo/vector-icons';
import { cardMargin } from '../styles/styles';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default class CreateCard extends React.Component {
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
    offset: {},
    currentlyViewedCard: 0,
    isCardFlipped: false,
    userInput: ''
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
            (SCREEN_WIDTH * 0.75 + cardMargin * 2) *
            this.state.flashcardsPosition.length,
          y: 0,
          animated: true
        });
      }
    );
  };

  handleLayoutChange(event, index) {
    this.feedPost.measure((fx, fy, width, height, px, py) => {
      const newFlashCardPosition = [...this.state.flashcardsPosition];
      newFlashCardPosition.push(fx);
      if (newFlashCardPosition[0] !== 0) {
        newFlashCardPosition.unshift(0);
      }
      this.setState({
        flashcardsPosition: newFlashCardPosition,
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
    const { flashcardsPosition, flashcards, currentlyViewedCard } = this.state;
    if (flashcardsPosition[0] !== 0) {
      console.log('on drag');
      flashcardsPosition.unshift(0);
    }
    const cardPosition = Math.round(
      targetContentOffset / flashcardsPosition[1]
    );

    let cardNumber =
      Number.isNaN(cardPosition) || cardPosition >= flashcardsPosition.length
        ? flashcardsPosition.length - 1
        : cardPosition;
    if (cardNumber === flashcards.length) {
      console.log('in if statement');
      cardNumber -= 1;
    }

    console.log('setting card position', cardNumber);

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
  handleOnCardDelete = () => {
    const { flashcards, currentlyViewedCard, flashcardsPosition } = this.state;
    let deletedCardIndex = null;
    console.log(currentlyViewedCard);
    console.log(flashcards);
    const updatedCards = flashcards.filter((flashcard, index) => {
      if (currentlyViewedCard !== index) {
        return flashcard;
      } else {
        deletedCardIndex = index;
      }
    });
    console.log('updatedCards', updatedCards);
    for (let i = 0; i < flashcardsPosition.length; i++) {
      if (i === deletedCardIndex) {
        flashcardsPosition.splice(i, 1);
      }
    }
    console.log(deletedCardIndex);
    console.log(flashcardsPosition);
    console.log(flashcards);
    this.setState(
      {
        currentlyViewedCard: deletedCardIndex - 1,
        flashcards: updatedCards,
        flashcardsPosition
      },
      () => {
        this.scroller.getNode().scrollTo({
          x: flashcardsPosition[this.state.currentlyViewedCard],
          y: 0,
          animated: true
        });
      }
    );
  };
  render() {
    const actionSheetHeight = {
      top:
        Dimensions.get('window').height -
        Dimensions.get('window').height * -0.05
    };

    const { flashcards, currentlyViewedCard, userInput } = this.state;

    const cardFacingPosition = flashcards[
      currentlyViewedCard ? currentlyViewedCard : 0
    ].isCardFlipped
      ? 'back'
      : 'front';
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={styles.container}>
          <TouchableOpacity onPress={this.handleOnCardDelete}>
            <Text style={styles.headerText}>Delete Card</Text>
          </TouchableOpacity>
          <View>
            <Text>{`${currentlyViewedCard + 1} - ${cardFacingPosition}`}</Text>
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
            snapToInterval={SCREEN_WIDTH * 0.75 + cardMargin * 2}
            contentInset={{
              top: 0,
              left: 0,
              bottom: 0,
              right: -SCREEN_WIDTH * 0.64
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
                        flashcard.isCardFlipped &&
                        flashcard.isCardFlipped
                      }
                      flipToSideB={
                        index === currentlyViewedCard &&
                        !flashcard.isCardFlipped &&
                        !flashcard.isCardFlipped
                      }
                      width={SCREEN_WIDTH * 0.75}
                      style={{ height: 250 }}
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
                width={SCREEN_WIDTH * 0.75}
                style={{ height: 250, ...styles.placeHolder }}
              >
                <Entypo name="plus" color={lightBlue} size={35} />
              </Card>
            </TouchableOpacity>
          </Animated.ScrollView>
        </View>
        <Button
          title={'Flip'}
          color={'red'}
          small
          onPress={() => this.handleCardFlip()}
        />
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
              placeholder="Enter deck title"
              onChangeText={this.handleInputChange}
              defaultValue={
                flashcards[currentlyViewedCard] &&
                flashcards[currentlyViewedCard][cardFacingPosition]
              }
              ref={ref => {
                this.FirstInput = ref;
              }}
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
