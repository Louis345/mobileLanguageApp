/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator,
  createMaterialTopTabNavigator
} from 'react-navigation';

// eslint-disable-next-line import/no-extraneous-dependencies
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import Menu from '../screens/Menu';
import Profile from '../screens/Profile';
import CreateDeck from '../screens/CreateDeck';
import CreateCard from '../screens/CreateCard';
import QRScanner from '../screens/QRScanner';
import Card from '../screens/Cards';
import LessonsMenu from '../screens/LessonsMenu';
import Quiz from '../screens/Quiz';

const topNavigator = createMaterialTopTabNavigator(
  {
    Lessons: {
      screen: LessonsMenu
    },
    Cards: {
      screen: Card
    },
    Quiz: {
      screen: Quiz,
      tabBarOptions: {
        showLabel: false
      }
    }
  },
  {
    swipeEnabled: false,
    tabBarOptions: {
      activeTintColor: '#32CDFF',
      inactiveTintColor: '#ddd',
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

const stackNavigator = createStackNavigator(
  {
    Home: Menu,
    CreateCard,
    Menu,
    LessonsMenu: {
      screen: topNavigator
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

stackNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;

  // eslint-disable-next-line prefer-destructuring
  const routeName = navigation.state.routes[navigation.state.index].routeName;

  console.log({ routeName });

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

topNavigator.navigationOptions = ({ navigation }) => {
  console.log({ navigation });
  let tabBarVisible = false;

  // eslint-disable-next-line prefer-destructuring
  const routeName = navigation.state.routes[navigation.state.index].routeName;

  if (routeName === 'CreateCard') {
    tabBarVisible = false;
  }

  if (routeName === 'LessonsMenu') {
    tabBarVisible = false;
  }

  return {
    showLabel: false
  };
};

const App = createAppContainer(bottomNavigator);

export default App;
