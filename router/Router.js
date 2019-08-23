/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator,
  createMaterialTopTabNavigator
} from 'react-navigation';
import { TouchableOpacity } from 'react-native';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { lightBlue } from '../styles/styles';
import Menu from '../screens/Menu';
import Profile from '../screens/Profile';
import CreateDeck from '../screens/CreateDeck';
import CreateCard from '../screens/CreateCard';
import QRScanner from '../screens/QRScanner';
import FlashcardScroll from '../screens/FlashcardScroll';
import LessonsMenu from '../screens/LessonsMenu';
import Quiz from '../screens/Quiz';

const topNavigator = createMaterialTopTabNavigator(
  {
    Lessons: {
      screen: LessonsMenu
    },
    Cards: {
      screen: FlashcardScroll
    },
    Quiz: {
      screen: Quiz
    }
  },
  {
    swipeEnabled: false,
    tabBarOptions: {
      activeTintColor: '#32CDFF',
      inactiveTintColor: '#ddd',
      showLabel: true,
      style: {
        backgroundColor: 'white'
      },
      indicatorStyle: {
        backgroundColor: '#32CDFF'
      },
      labelStyle: {
        fontSize: 15,
        fontWeight: 'bold'
      }
    }
  }
);

const headerForTabs = createStackNavigator({
  Home: {
    screen: topNavigator,
    navigationOptions: ({ navigation }) => {
      return {
        headerStyle: {
          borderBottomWidth: 0,
          height: 20
        },
        headerLeftContainerStyle: {
          marginLeft: 30
        },
        headerLeft: () => {
          return (
            <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
              <FontAwesome name="long-arrow-left" size={20} color={lightBlue} />
            </TouchableOpacity>
          );
        }
      };
    }
  }
});

headerForTabs.navigationOptions = () => {
  return {
    headerRight: (
      <TouchableOpacity>
        <FontAwesome name="long-arrow-left" />
      </TouchableOpacity>
    )
  };
};

const stackNavigator = createStackNavigator(
  {
    Home: Menu,
    CreateCard,
    Menu,
    LessonsMenu: {
      screen: headerForTabs
    }
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false
    }
  }
);

const bottomNavigator = createBottomTabNavigator({
  Home: {
    screen: stackNavigator,
    animationEnabled: true,
    navigationOptions: () => ({
      title: 'Home',
      tabBarPosition: 'bottom',
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        navigation.navigate('Home');
        defaultHandler();
      },
      tabBarIcon: () => <AntDesign name="plus" />
    })
  },
  CreateDeck: {
    screen: CreateDeck,
    animationEnabled: true,
    navigationOptions: () => ({
      tabBarPosition: 'bottom',
      title: 'Create Deck',
      tabBarVisible: false,
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        navigation.navigate('CreateDeck');
        navigation.setParams({ flashcards: null, title: null });
        defaultHandler();
      },
      tabBarIcon: () => <AntDesign name="plus" />
    })
  },
  Profile: {
    screen: Profile,
    animationEnabled: true,
    navigationOptions: () => ({
      tabBarPosition: 'bottom',
      title: 'Profile',
      tabBarIcon: () => <FontAwesome name="user" />
    })
  },
  Scan: {
    screen: QRScanner,
    animationEnabled: true,
    navigationOptions: () => ({
      tabBarPosition: 'bottom',
      title: 'Scan',
      tabBarIcon: () => <Ionicons name="ios-qr-scanner" />
    })
  }
});

topNavigator.navigationOptions = () => {};

stackNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;

  // eslint-disable-next-line prefer-destructuring
  const routeName = navigation.state.routes[navigation.state.index].routeName;

  if (routeName === 'CreateCard') {
    tabBarVisible = false;
  }

  if (routeName === 'LessonsMenu') {
    tabBarVisible = false;
  }

  return {
    tabBarVisible
  };
};

const App = createAppContainer(bottomNavigator);

export default App;
