import React from 'react';
import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator,
  createMaterialTopTabNavigator
} from 'react-navigation';

import { lightBlue, menuHeader } from '../styles/styles';
import Menu from '../screens/Menu';
import Profile from '../screens/Profile';
import CreateDeck from '../screens/CreateDeck';
import CreateCard from '../screens/CreateCard';
import QRScanner from '../screens/QRScanner';
import Card from '../screens/Cards';
import LessonsMenu from '../screens/LessonsMenu';

import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';

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
    Details: CreateCard,
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
    navigationOptions: ({ navigation }) => ({
      title: 'Home',
      tabBarPosition: 'bottom',
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        navigation.navigate('Home');
        defaultHandler();
      },
      tabBarIcon: ({ tintColor }) => <AntDesign name={'plus'} />
    })
  },
  CreateDeck: {
    screen: CreateDeck,
    animationEnabled: true,
    navigationOptions: ({ navigation }) => ({
      tabBarPosition: 'bottom',
      title: 'Create Deck',
      tabBarPosition: 'bottom',
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        navigation.navigate('CreateDeck');
        defaultHandler();
      },
      tabBarIcon: ({ tintColor }) => <AntDesign name={'plus'} />
    })
  },
  Profile: {
    screen: Profile,
    animationEnabled: true,
    navigationOptions: ({ navigation }) => ({
      tabBarPosition: 'bottom',
      title: 'Profile',
      tabBarIcon: ({ tintColor }) => <FontAwesome name={'user'} />
    })
  },
  Scan: {
    screen: QRScanner,
    animationEnabled: true,
    navigationOptions: ({ navigation }) => ({
      tabBarPosition: 'bottom',
      title: 'Scan',
      tabBarIcon: ({ tintColor }) => <Ionicons name={'ios-qr-scanner'} />
    })
  }
});

const App = createAppContainer(bottomNavigator);

export default App;
