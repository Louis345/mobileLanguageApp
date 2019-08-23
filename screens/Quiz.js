import React from 'react';
import {
  Text,
  View,
  SafeAreaView,
  Animated,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import withNavigationContextConsumer from '../context/with-navigation-context-consumer';
import Card from '../components/Card/Card';
import { lightBlue, cardWidth } from '../styles/styles';
import AsyncStorage from '../util/fetchData';
import ProgressBar from '../components/ProgressBar/ProgressBar';
import MS from 'memory-scheduler';
const SessionIntervalsinDays = [2, 3, 5, 8, 17, 30, 60, 90, 180, 360];
const QuizResultToProgress = [-1, 1];
const DAY_IN_MILISECONDS = 24 * 60 * 60 * 1000;
const GetTodayDayNumber = Math.round(new Date().getTime() / DAY_IN_MILISECONDS);
class FlashCardQuiz extends React.PureComponent {
  state = {
    angle: new Animated.Value(0),
    moveRightDirection: new Animated.Value(0),
    moveLeftDirection: new Animated.Value(0),
    isAnswerCompleted: false,
    currentlyViewedCard: 0,
    currentQuestions: [],
    progress: 0,
    isQuizComplete: false
  };
  /**
   *  On complete, call DeckApi
   *
   *
   */
  async componentDidMount() {
    const { selectedCardDeck } = this.props;

    const deck = await AsyncStorage.getDeckList(selectedCardDeck);
    this.setState(
      {
        deck: deck.flashcards,
        cardSide: Math.floor(Math.random() * 2) === 1 ? 'front' : 'back'
      },
      () => {
        this.generateQuestions();
      }
    );
    this.SpacedRepetition = new MS(
      SessionIntervalsinDays,
      QuizResultToProgress
    );
  }

  async componentDidUpdate(prevProps) {
    if (this.props.selectedCardDeck !== prevProps.selectedCardDeck) {
      const { selectedCardDeck } = this.props;
      const deck = await AsyncStorage.getDeckList(selectedCardDeck);
      this.setState(
        {
          deck: deck.flashcards,
          cardSide: Math.floor(Math.random() * 2) === 1 ? 'front' : 'back'
        },
        () => {
          this.generateQuestions();
        }
      );
      this.SpacedRepetition = new MS(
        SessionIntervalsinDays,
        QuizResultToProgress
      );
    }
  }
  answerCompletedAnimation = userSelectedAnswer => {
    const {
      currentlyViewedCard,
      deck,
      isQuizComplete,
      currentAnswer
    } = this.state;
    currentlyViewedCard === deck.length - 1 && this.onComplete();
    if (this.state.cardSide === 'front') {
      if (userSelectedAnswer.back === currentAnswer) {
        userSelectedAnswer.isCorrect = true;
      } else {
        userSelectedAnswer.isCorrect = false;
      }
    } else {
      if (userSelectedAnswer.front === currentAnswer) {
        userSelectedAnswer.isCorrect = true;
      } else {
        userSelectedAnswer.isCorrect = false;
      }
    }

    Animated.timing(this.state.moveRightDirection, {
      toValue: 1,
      duration: 500
    }).start(() => {
      this.setState(
        {
          isAnswerCompleted: true,
          currentlyViewedCard: ++this.state.currentlyViewedCard,
          cardSide: Math.floor(Math.random() * 2) === 1 ? 'front' : 'back'
        },
        () => {
          this.newAnswerStartAnimation();
          const { isQuizComplete } = this.state;

          !isQuizComplete && this.generateQuestions();
        }
      );
    });
  };

  generateQuestions = () => {
    const { currentlyViewedCard, deck, cardSide } = this.state;
    const NumberOfAnswersToBeRemoved = deck.length - 1 - 3;
    const randomPlaceToInsertAnswer = Math.floor(Math.random() * 2);

    let removedAnswerFromDeck = deck.filter((flashcard, index) => {
      if (index !== currentlyViewedCard) {
        return flashcard;
      }
    });

    removedAnswerFromDeck.splice(0, NumberOfAnswersToBeRemoved);

    const questions = removedAnswerFromDeck.map((flashcard, index) => {
      if (index === randomPlaceToInsertAnswer) {
        return deck[currentlyViewedCard];
      }
      return flashcard;
    });

    this.setState({
      currentQuestions: questions,
      currentAnswer:
        deck[currentlyViewedCard][cardSide === 'front' ? 'back' : 'front']
    });
  };

  newAnswerStartAnimation = () => {
    const { deck, currentlyViewedCard } = this.state;

    const percentToCompletion = 100 / deck.length;

    this.state.moveRightDirection.setValue(0);
    Animated.sequence([
      Animated.timing(this.state.moveLeftDirection, {
        toValue: 1,
        duration: 500
      })
    ]).start(
      this.setState({
        isAnswerCompleted: false,
        progress: this.state.progress + percentToCompletion
      })
    );
  };

  renderCards = () => {
    const { deck, currentlyViewedCard, cardSide } = this.state;
    return (
      <View>
        <Card style={{ width: cardWidth, height: 300 }}>
          <Text>{deck[currentlyViewedCard][cardSide]}</Text>
        </Card>
      </View>
    );
  };
  renderQuestion = () => {
    const { currentQuestions, cardSide } = this.state;
    return currentQuestions.map((question, index) => {
      return (
        <TouchableOpacity
          key={index}
          style={styles.question}
          onPress={() => this.answerCompletedAnimation(question)}
        >
          <Text style={styles.questionText}>
            {question[cardSide === 'back' ? 'front' : 'back']}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  DayNumberToMMDDYY = time => {
    let DateTime = new Date(parseInt(time * DAY_IN_MILISECONDS, 10));
    let dd = String(DateTime.getDate()).padStart(2, '0');
    let mm = String(DateTime.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = DateTime.getFullYear();
    let today = mm + '/' + dd + '/' + yyyy;
    return today;
  };

  onComplete = () => {
    const { deck } = this.state;
    const addedRepetitionToDeck = deck.map((flashcard, index) => {
      const newRecord = this.SpacedRepetition.calculate(
        flashcard.isCorrect ? 1 : 0,
        flashcard,
        GetTodayDayNumber
      );
      flashcard['progress'] = newRecord.progress;
      flashcard['dueDate'] =
        newRecord.progress > SessionIntervalsinDays.length
          ? 'never'
          : this.DayNumberToMMDDYY(newRecord.dueDate);
      return flashcard;
    });

    this.setState({
      isQuizComplete: true
    });
  };

  render() {
    const { deck, isAnswerCompleted, isQuizComplete } = this.state;

    const animatedMoveLeftDirectionStyles = {
      transform: [
        {
          translateX: this.state.moveLeftDirection.interpolate({
            inputRange: [0, 1],
            outputRange: [10000, 0]
          })
        }
      ]
    };

    const animatedMoveRightDirectionStyles = {
      transform: [
        {
          translateX: this.state.moveRightDirection.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -10000]
          })
        }
      ]
    };

    return (
      <SafeAreaView
        style={{
          flex: 1
        }}
      >
        <View
          style={{
            flex: 0.1,
            justifyContent: 'center',
            marginLeft: '10%',
            marginRight: '10%'
          }}
        >
          <ProgressBar percent={this.state.progress} animateStart={true} />
        </View>
        <Animated.View
          style={[
            styles.container,
            isAnswerCompleted
              ? animatedMoveLeftDirectionStyles
              : animatedMoveRightDirectionStyles
          ]}
        >
          {!isQuizComplete && deck && deck.length > 0 && this.renderCards()}
          <View style={{ justifyContent: 'center', width: '90%' }}>
            {!isQuizComplete &&
              deck &&
              deck.length > 0 &&
              this.renderQuestion()}
          </View>
        </Animated.View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0.9,
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  question: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: lightBlue,
    height: 60,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  questionText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: lightBlue,
    fontSize: 20,
    width: '100%'
  }
});

const Quiz = withNavigationContextConsumer(FlashCardQuiz);

export default Quiz;
