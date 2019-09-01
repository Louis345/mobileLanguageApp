import React from "react";
import {
  Text,
  View,
  SafeAreaView,
  Animated,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import withNavigationContextConsumer from "../context/with-navigation-context-consumer";
import Card from "../components/Card/Card";
import { lightBlue, cardWidth } from "../styles/styles";
import AsyncStorage from "../util/fetchData";
import ProgressBar from "../components/ProgressBar/ProgressBar";
import LottieView from "lottie-react-native";
import MS from "memory-scheduler";
import Gradient from "react-native-css-gradient";
const SessionIntervalsinDays = [2, 3, 5, 8, 17, 30, 60, 90, 180, 360];
const QuizResultToProgress = [-1, 1];
const DAY_IN_MILISECONDS = 24 * 60 * 60 * 1000;
const GetTodayDayNumber = Math.round(new Date().getTime() / DAY_IN_MILISECONDS);
const GRADIENTS = {
  upset: "linear-gradient(to bottom, rgb(231, 97, 97), rgb(236, 49, 49))",
  sad: "linear-gradient(to bottom, rgb(247,152,48), rgb(231, 97, 97))",
  neutral: "linear-gradient(to bottom, rgb(243, 189, 67), rgb(203,96,32))",
  smile: "linear-gradient(to bottom, rgb(238,172,77), rgb(187, 230, 95))",
  excited: "linear-gradient(to bottom, rgb(95,230,118), rgb(46, 232, 78))"
};
class FlashCardQuiz extends React.PureComponent {
  state = {
    angle: new Animated.Value(0),
    answerAnimation: new Animated.Value(0),
    moveRightDirection: new Animated.Value(0),
    moveLeftDirection: new Animated.Value(0),
    isAnswerCompleted: false,
    currentlyViewedCard: 0,
    currentQuestions: [],
    progress: 0,
    isQuizComplete: false
  };

  async componentDidMount() {
    const { selectedCardDeck } = this.props;

    const deck = await AsyncStorage.getDeckList(selectedCardDeck);
    console.log({ deck });
    this.setState(
      {
        deck: deck.flashcards,
        cardSide: Math.floor(Math.random() * 2) === 1 ? "front" : "back"
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
          cardSide: Math.floor(Math.random() * 2) === 1 ? "front" : "back"
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
  answerCompletedAnimation = () => {
    const { currentlyViewedCard, deck } = this.state;
    currentlyViewedCard === deck.length - 1 && this.onComplete();

    Animated.timing(this.state.moveRightDirection, {
      toValue: 1,
      duration: 500
    }).start(() => {
      this.setState(
        {
          isAnswerCompleted: true,
          currentlyViewedCard: ++this.state.currentlyViewedCard,
          cardSide: Math.floor(Math.random() * 2) === 1 ? "front" : "back"
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
    const randomPlaceToInsertAnswer = Math.floor(Math.random() * 3);

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
        deck[currentlyViewedCard][cardSide === "front" ? "back" : "front"]
    });
  };

  newAnswerStartAnimation = () => {
    const { deck } = this.state;

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

  s;

  renderCards = () => {
    const AnimatedStyles = {
      height: this.state.answerAnimation
    };
    const {
      deck,
      currentlyViewedCard,
      cardSide,
      showAnwser,
      isAnswerCorrect
    } = this.state;

    return (
      <View>
        <Card style={{ width: cardWidth, height: 300 }}>
          {!showAnwser ? (
            <Text>{deck[currentlyViewedCard][cardSide]}</Text>
          ) : (
            <View
              style={{
                position: "relative",
                height: 300,
                width: cardWidth
              }}
            >
              <Animated.View
                style={[
                  {
                    position: "absolute",
                    backgroundColor: "green",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: "100%",
                    borderRadius: 20
                  },
                  AnimatedStyles
                ]}
              >
                <TouchableOpacity onPress={() => this.animate()}>
                  <View>
                    <LottieView
                      ref={animation => {
                        this.animation = animation;
                      }}
                      style={[
                        StyleSheet.absoluteFill,
                        {
                          width: cardWidth,
                          height: 300
                        }
                      ]}
                      source={
                        isAnswerCorrect
                          ? require("../assets/correct.json")
                          : require("../assets/wrong.json")
                      }
                    />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </View>
          )}
        </Card>
      </View>
    );
  };

  displayAnswerAnimation = userSelectedAnswer => {
    const { currentAnswer, cardSide, deck, currentlyViewedCard } = this.state;

    deck[currentlyViewedCard]["isCorrect"] = false;
    if (cardSide === "front") {
      if (userSelectedAnswer.back === currentAnswer) {
        deck[currentlyViewedCard]["isCorrect"] = true;
      }
    } else {
      if (userSelectedAnswer.front === currentAnswer) {
        deck[currentlyViewedCard]["isCorrect"] = true;
      }
    }
    this.setState(
      {
        showAnwser: true,
        isAnswerCorrect: deck[currentlyViewedCard]["isCorrect"]
      },
      () => {
        Animated.timing(this.state.answerAnimation, {
          toValue: 300,
          duration: 100
        }).start(() => {
          this.animation.play();
          setTimeout(() => {
            this.answerCompletedAnimation(userSelectedAnswer);
            this.state.answerAnimation.setValue(0);
            this.setState({
              showAnwser: false
            });
          }, 1000);
        });
      }
    );
  };

  renderQuestion = () => {
    const { currentQuestions, cardSide } = this.state;
    return currentQuestions.map((question, index) => {
      return (
        <TouchableOpacity
          key={index}
          style={styles.question}
          onPress={() => this.displayAnswerAnimation(question)}
        >
          <Text style={styles.questionText}>
            {question[cardSide === "back" ? "front" : "back"]}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  DayNumberToMMDDYY = time => {
    let DateTime = new Date(parseInt(time * DAY_IN_MILISECONDS, 10));
    let dd = String(DateTime.getDate()).padStart(2, "0");
    let mm = String(DateTime.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = DateTime.getFullYear();
    let today = mm + "/" + dd + "/" + yyyy;
    return today;
  };

  onComplete = async () => {
    const { deck } = this.state;
    const { selectedCardDeck } = this.props;
    console.log({ deck });
    const addedRepetitionToDeck = deck.map((flashcard, index) => {
      const newRecord = this.SpacedRepetition.calculate(
        flashcard.isCorrect ? 1 : 0,
        flashcard,
        GetTodayDayNumber
      );
      console.log({ newRecord });
      flashcard["progress"] = newRecord.progress;
      flashcard["dueDate"] =
        newRecord.progress > SessionIntervalsinDays.length
          ? "never"
          : this.DayNumberToMMDDYY(newRecord.dueDate);
      console.log({ flashcard });
      return flashcard;
    });

    let response = await AsyncStorage.setDeck(
      selectedCardDeck,
      addedRepetitionToDeck
    );
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
            justifyContent: "center",
            marginLeft: "10%",
            marginRight: "10%"
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
          <View style={{ justifyContent: "center", width: "90%" }}>
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
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  question: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: lightBlue,
    height: 60,
    marginBottom: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  questionText: {
    textAlign: "center",
    fontWeight: "bold",
    color: lightBlue,
    fontSize: 20,
    width: "100%"
  }
});

const Quiz = withNavigationContextConsumer(FlashCardQuiz);

export default Quiz;
