import React from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Animated
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import AsyncStorage from '../util/fetchData';
import {
  lightBlue,
  cardBoxShadow,
  cardWidth,
  cardMargin
} from '../styles/styles';

import { Entypo } from '@expo/vector-icons';
import Card from '../components/Card/Card';
import ActionSheet from '../components/ActionSheet/ActionSheet';

const cardWithPadding = cardWidth + cardMargin * 2;

export default class CreateDeck extends React.Component {
  state = {
    isInputFocused: false,
    openActionSheet: false
  };

  setInputFocus = () => {
    this.setState({
      isInputFocused: !this.state.isInputFocused,
      openActionSheet: true
    });
  };

  static getDerivedStateFromProps(prevProps, prevState) {
    const {
      navigation: {
        state: {
          params: { title }
        }
      }
    } = prevProps;

    if (prevState.title === '') {
      return {
        title: ''
      };
    }

    if (title) {
      return {
        title
      };
    }
    if (prevState.title) {
      return {
        title: prevState.title
      };
    }
    return {
      title: ''
    };
  }

  handleTitleChange = title => {
    this.setState({
      title
    });
  };

  handleCardFlip = currentlyViewedCard => {
    const {
      navigation: {
        state: {
          params: { flashcards }
        }
      }
    } = this.props;

    const updatedCards = flashcards.map((flashcard, index) => {
      if (currentlyViewedCard === index) {
        flashcard.isCardFlipped = !flashcard.isCardFlipped;
      }
      return flashcard;
    });
    this.setState({
      flashcards: updatedCards
    });
  };

  handleCreateDeck = async () => {
    const { title } = this.state;

    const {
      navigation: {
        state: {
          params: { flashcards }
        }
      }
    } = this.props;

    let response = await AsyncStorage.setDeck(title, flashcards);
    if (!response) {
      this.setState(
        {
          title: null
        },
        () => {
          this.props.navigation.navigate('Menu');
        }
      );
    }
  };

  handleIconPress = () => {
    this.props.navigation.navigate('CreateCard');
  };
  renderCardList = () => {
    const {
      navigation: {
        state: {
          params: { flashcards }
        }
      }
    } = this.props;

    return (
      //To Do this can become a component

      <Animated.ScrollView
        contentContainerStyle={{
          alignItems: 'center'
        }}
        horizontal
        snapToAlignment={'center'}
        snapToInterval={cardWithPadding}
        contentInset={{
          top: 0,
          left: 0,
          bottom: 0,
          right: -cardWidth * 0.7
        }}
      >
        {flashcards.map((flashcard, index) => {
          return (
            <TouchableOpacity onPress={() => this.handleCardFlip(index)}>
              <Card
                width={cardWidth}
                style={{
                  height: 250
                }}
                SideB={flashcard.back === '' ? 'Enter Text' : flashcard.back}
                flipToSideA={flashcard.isCardFlipped}
                flipToSideB={!flashcard.isCardFlipped}
              >
                <View
                  style={{
                    height: 250,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Text>
                    {flashcard.front === '' ? 'Enter Text' : flashcard.front}
                  </Text>
                </View>
              </Card>
              <View style={styles.editIcon}>
                <Entypo
                  name="pencil"
                  size={30}
                  onPress={() =>
                    this.props.navigation.navigate('CreateCard', {
                      scrollToCard: index,
                      flashcards
                    })
                  }
                />
              </View>
            </TouchableOpacity>
          );
        })}
        <Card
          style={styles.placeHolder}
          width={cardWidth}
          style={{ height: 250, ...styles.placeHolder }}
        >
          <Entypo name="plus" color={lightBlue} size={35} />
        </Card>
      </Animated.ScrollView>
    );
  };
  render() {
    const { isInputFocused } = this.state;
    const {
      navigation: {
        state: { params }
      }
    } = this.props;

    const inputIconStyles = {
      type: 'font-awesome',
      name: 'chevron-right',
      color: '#D9D9D9'
    };
    const actionSheetHeight = {
      top:
        Dimensions.get('window').height -
        Dimensions.get('window').height * -0.05
    };

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() =>
              this.setState({ title: '' }, () => {
                this.props.navigation.navigate('Menu');
              })
            }
          >
            <Text style={styles.headerButtonText}>Close</Text>
          </TouchableOpacity>
          <Text style={[styles.headerButtonText, styles.headerText]}>
            Create Deck
          </Text>
        </View>
        <View style={styles.headerContainer}>
          <View style={styles.cardPlaceHolderContainer}>
            <Card
              style={[styles.cardPlaceHolderStyles, { ...cardBoxShadow }]}
            />
          </View>
          <View style={styles.inputContainer}>
            <Input
              placeholder="Title"
              rightIcon={inputIconStyles}
              onFocus={this.setInputFocus}
              editable={!isInputFocused ? true : false}
              value={this.state.title}
            />
            <Input
              editable={!isInputFocused ? true : false}
              onFocus={this.setInputFocus}
              placeholder="Description (Optional)"
              rightIcon={inputIconStyles}
            />
          </View>
        </View>
        <View style={styles.bodyContainer}>
          {params &&
          params.flashcards &&
          Object.keys(params.flashcards).length > 0 ? (
            this.renderCardList()
          ) : (
            <TouchableOpacity onPress={() => this.handleIconPress()}>
              <Card style={styles.createDeckContainer}>
                <Entypo name="plus" color={lightBlue} size={35} />
              </Card>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.footer}>
          <Button title="Create Deck" onPress={this.handleCreateDeck} />
        </View>
        <ActionSheet
          animatePanel={this.state.openActionSheet}
          height={actionSheetHeight}
          input={this}
        >
          <View style={[styles.createTitle]}>
            <View style={[styles.header, styles.center]}>
              <Text style={[styles.headerButtonText, { marginRight: 'auto' }]}>
                Edit Title
              </Text>
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    openActionSheet: false,
                    isInputFocused: false
                  })
                }
              >
                <Text style={[styles.headerButtonText]}>Done</Text>
              </TouchableOpacity>
            </View>
            <View>
              <Input
                placeholder="Enter deck title"
                onChangeText={this.handleTitleChange}
                ref={ref => {
                  this.FirstInput = ref;
                }}
              />
            </View>
          </View>
        </ActionSheet>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    margin: 10
  },
  createTitle: {
    flex: 1
  },
  headerText: {
    textAlign: 'center',
    flex: 0.9
  },
  cardPlaceHolderContainer: {
    flex: 0.4
  },
  center: {
    textAlign: 'center',
    justifyContent: 'center'
  },
  cardPlaceHolderStyles: {
    height: 120,
    width: 100,
    marginTop: 0,
    justifyContent: 'center',
    marginLeft: 10
  },
  headerButtonText: {
    color: lightBlue,
    fontSize: 20,
    fontWeight: 'bold'
  },
  textInput: {
    borderBottomWidth: 2,
    borderBottomColor: '#EEEEEE'
  },
  headerContainer: {
    flexDirection: 'row'
  },
  inputContainer: {
    flex: 0.6
  },
  bodyContainer: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flex: 1
  },
  footer: {
    margin: 30
  },
  placeHolder: {
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  editIcon: {
    position: 'absolute',
    left: cardWidth - 30,
    right: 0,
    bottom: 20,
    zIndex: 20000
  },
  createDeckContainer: {
    height: 300,
    width: 250,
    borderRadius: 20,
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
