import React from 'react';
import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator
} from 'react-navigation';
import Menu from '../screens/Menu';
import Profile from '../screens/Profile';
import CreateDeck from '../screens/CreateDeck';
import CreateCard from '../screens/CreateCard';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
const navigationConfig = () => {
  return {
    screenInterpolator: sceneProps => {
      const position = sceneProps.position;
      const scene = sceneProps.scene;
      const index = scene.index;
      return fadeTransition(index, position);
    }
  };
};

const fadeTransition = (index, position) => {
  const sceneRange = [index - 1, index];
  const outPutRangeOpacity = [0, 1];
  const transition = position.interpolate({
    inputRange: sceneRange,
    outPutRange: outPutRangeOpacity
  });
  return {
    opacity: transition
  };
};
const stackNavigator = createStackNavigator(
  {
    Home: CreateCard,
    Details: CreateCard
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
      tabBarIcon: ({ tintColor }) => (
        <AntDesign name={'plus'} onPress={() => navigation.navigate('Menu')} />
      )
    })
  },
  CreateDeck: {
    screen: CreateDeck,
    animationEnabled: true,
    navigationOptions: ({ navigation }) => ({
      tabBarPosition: 'bottom',
      title: 'Create Deck',
      tabBarIcon: ({ tintColor }) => (
        <AntDesign name={'plus'} onPress={() => console.log(navigation)} />
      )
    })
  },
  Profile: {
    screen: Profile,
    navigationOptions: ({ navigation }) => ({
      tabBarPosition: 'bottom',
      title: 'Profile',
      tabBarIcon: ({ tintColor }) => <FontAwesome name={'user'} />
    })
  }
});

const App = createAppContainer(bottomNavigator);

export default App;
