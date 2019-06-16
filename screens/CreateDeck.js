import React from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import { buttonColors, cardBoxShadow } from '../styles/styles';
import { Entypo } from '@expo/vector-icons';
import Card from '../components/Card/Card';
import ActionSheet from '../components/ActionSheet/ActionSheet';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default class CreateDeck extends React.Component {
  state = {
    isInputFocused: false,
    openActionSheet: false,
    title: ''
  };

  setInputFocus = () => {
    this.setState({
      isInputFocused: !this.state.isInputFocused,
      openActionSheet: true
    });
  };

  handleInputChange = input => {
    this.setState({
      title: input
    });
  };

  handleCardPress = () => {
    this.props.navigation.navigate('Details');
  };

  render() {
    const { isInputFocused } = this.state;
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
          <Text style={styles.headerButtonText}>Close</Text>
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
          <TouchableOpacity onPress={() => this.handleCardPress()}>
            <Card
              style={{ height: 300, width: 250, borderRadius: 20, margin: 0 }}
            >
              <Entypo name="plus" color={buttonColors} size={35} />
            </Card>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <Button title="Create Deck" />
        </View>
        <ActionSheet
          animatePanel={this.state.openActionSheet}
          height={actionSheetHeight}
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
                onChangeText={this.handleInputChange}
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
    justifyContent: 'space-evenly',
    backgroundColor: '#fff'
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
    color: buttonColors,
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
    justifyContent: 'center',
    flex: 1
  },
  footer: {
    margin: 30
  }
});
