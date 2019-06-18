import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Animated
} from 'react-native';
import Card from '../components/Card/Card';
import ActionSheet from '../components/ActionSheet/ActionSheet';
import { buttonColors } from '../styles/styles';
import { Input, Button } from 'react-native-elements';
import { Entypo } from '@expo/vector-icons';
import { cardMargin } from '../styles/styles';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default class CreateCard extends React.Component {
  state = {
    isPanelOpen: false,
    flipCard: false,
    flashCards: [''],
    flashCardsPosition: [],
    offset: {},
    currentlyViewedCard: null
  };
  handleNewCard = () => {
    const { currentlyViewedCard } = this.state;
    const newFlashCards = [...this.state.flashCards];
    newFlashCards.push('new Card');
    this.setState(
      {
        flashCards: newFlashCards
      },
      () => {
        this.scroller.getNode().scrollTo({
          x:
            (SCREEN_WIDTH * 0.75 + cardMargin * 2) *
            this.state.flashCardsPosition.length,
          y: 0,
          animated: true
        });
      }
    );
  };

  handleLayoutChange(event, index) {
    this.feedPost.measure((fx, fy, width, height, px, py) => {
      const newFlashCardPosition = [...this.state.flashCardsPosition];
      newFlashCardPosition.push(fx);
      this.setState({
        flashCardsPosition: newFlashCardPosition,
        currentlyViewedCard: index
      });
    });
  }

  handleOnScrollEndDrag = (targetContentOffset, event) => {
    const { flashCardsPosition } = this.state;
    const cardPosition = Math.round(
      targetContentOffset / flashCardsPosition[1]
    );
    this.setState({
      currentlyViewedCard: cardPosition
    });
  };

  render() {
    const actionSheetHeight = {
      top:
        Dimensions.get('window').height -
        Dimensions.get('window').height * -0.05
    };
    console.log(Dimensions.get('window').width);
    console.log(this.state.flashCardsPosition);
    const { flashCards, currentlyViewedCard } = this.state;
    console.log(this.state.flashCards.length === 1);
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={styles.container}>
          <View>
            <Text>Delete Card</Text>
          </View>
          <View>
            <Text>{`${currentlyViewedCard} - Front`}</Text>
          </View>
          <View>
            <Text>Done</Text>
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
            {flashCards.map((flashcard, index) => {
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
                  <Card
                    flipToSideA={
                      index === currentlyViewedCard &&
                      this.state.flipCard &&
                      this.state.flipCard
                    }
                    flipToSideB={
                      index === currentlyViewedCard &&
                      !this.state.flipCard &&
                      !this.state.flipCard
                    }
                    width={SCREEN_WIDTH * 0.75}
                    style={{ height: 250 }}
                  >
                    <View>
                      <Text>{index}</Text>
                    </View>
                  </Card>
                </View>
              );
            })}
            <TouchableOpacity onPress={() => this.handleNewCard()}>
              <Card
                style={styles.placeHolder}
                width={SCREEN_WIDTH * 0.75}
                style={{ height: 250, ...styles.placeHolder }}
              >
                <Entypo name="plus" color={buttonColors} size={35} />
              </Card>
            </TouchableOpacity>
          </Animated.ScrollView>
        </View>
        <ActionSheet
          animatePanel={this.state.isPanelOpen}
          height={actionSheetHeight}
        >
          <View style={[styles.createTitle]}>
            <View style={[styles.header, styles.center]}>
              <Text style={[styles.headerButtonText, { marginRight: 'auto' }]}>
                Edit Front
              </Text>
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    isPanelOpen: false,
                    isInputFocused: false
                  })
                }
              >
                <Text style={[styles.headerButtonText]}>Done</Text>
              </TouchableOpacity>
            </View>
            <Input
              placeholder="Enter deck title"
              onChangeText={this.handleInputChange}
            />
          </View>
        </ActionSheet>
        <Button
          title={'Flip'}
          onPress={() => this.setState({ flipCard: !this.state.flipCard })}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between'
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
    color: buttonColors,
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
