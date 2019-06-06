import React from 'react';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import Menu from '../screens/Menu';
import Profile from '../screens/Profile';
import CreateDeck from '../screens/CreateDeck';
import { AntDesign, FontAwesome } from '@expo/vector-icons';

const bottomNavigator = createBottomTabNavigator({
  Home: {
    screen: Menu,
    navigationOptions: ({ navigation }) => ({
      title: 'Home',
      tabBarIcon: ({ tintColor }) => (
        <AntDesign name={'plus'} onPress={() => navigation.navigate('Menu')} />
      )
    })
  },
  CreateDeck: {
    screen: CreateDeck,
    navigationOptions: ({ navigation }) => ({
      title: 'Create Deck',
      tabBarIcon: ({ tintColor }) => (
        <AntDesign name={'plus'} onPress={() => console.log(navigation)} />
      )
    })
  },
  Profile: {
    screen: Profile,
    navigationOptions: ({ navigation }) => ({
      title: 'Profile',
      tabBarIcon: ({ tintColor }) => (
        <FontAwesome
          name={'user'}
          onPress={() => navigation.navigate('Profile')}
        />
      )
    })
  }
});

const App = createAppContainer(bottomNavigator);

export default App;
