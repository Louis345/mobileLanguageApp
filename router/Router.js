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

const topNavigator = createMaterialTopTabNavigator(
  {
    Lessons: {
      screen: LessonsMenu
    },
    Cards: {
      screen: Card
    },
    Quiz: {
      screen: LessonsMenu
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
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        navigation.navigate('CreateDeck');
        navigation.setParams({ flashcards: null });
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

const App = createAppContainer(bottomNavigator);

export default App;
