/* eslint-disable react/jsx-filename-extension */
import React from "react";
import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator,
  createMaterialTopTabNavigator
} from "react-navigation";
import { TouchableOpacity, View } from "react-native";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";

// eslint-disable-next-line import/no-extraneous-dependencies
import { summerSky } from "../styles/styles";
import Menu from "../screens/Menu";
import Profile from "../screens/Profile";
import CreateDeck from "../screens/CreateDeck";
import CreateCard from "../screens/CreateCard";
import QRScanner from "../screens/QRScanner";
import FlashcardScroll from "../screens/FlashcardScroll";
import LessonsMenu from "../screens/LessonsMenu";
import QuizStart from "../screens/QuizStart";
import Quiz from "../screens/Quiz";
import Speak from "../screens/Speak";
import FilePickerMenu from "../screens/FilePickerMenu";
import ImagePicker from "../screens/ImagePicker";
import Camera from "../screens/Camera";

const topNavigator = createMaterialTopTabNavigator(
  {
    Lessons: {
      screen: LessonsMenu
    },
    Cards: {
      screen: FlashcardScroll
    },
    Quiz: {
      screen: QuizStart,
      navigationOptions: {
        gesturesEnabled: false
      }
    }
  },
  {
    swipeEnabled: false,
    tabBarOptions: {
      activeTintColor: summerSky,

      inactiveTintColor: "#ddd",
      showLabel: true,
      style: {
        backgroundColor: "white"
      },
      indicatorStyle: {
        backgroundColor: summerSky
      },
      labelStyle: {
        fontSize: 15,
        fontWeight: "bold"
      }
    },
    defaultNavigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  }
);

const headerForTabs = createStackNavigator(
  {
    Home: {
      screen: topNavigator,
      swipeEnabled: false,
      navigationOptions: ({ navigation }) => {
        return {
          headerStyle: {
            borderBottomWidth: 0,
            height: 20
          },
          defaultNavigationOptions: {
            gesturesEnabled: false
          },
          headerLeftContainerStyle: {
            marginLeft: 30,
            marginRight: 30,
            flex: 1
          },
          headerLeft: () => {
            return (
              <View>
                <TouchableOpacity onPress={() => navigation.navigate("Menu")}>
                  <FontAwesome
                    name="long-arrow-left"
                    size={20}
                    color={summerSky}
                  />
                </TouchableOpacity>
              </View>
            );
          }
        };
      }
    },
    Modal: {
      screen: Quiz
    }
  },
  {
    mode: "modal"
  }
);

const stackNavigator = createStackNavigator(
  {
    Home: Menu,
    CreateCard,
    Menu,
    LessonsMenu: {
      screen: headerForTabs
    },
    QRScanner: {
      screen: QRScanner
    },
    ImagePicker: {
      screen: ImagePicker
    },
    Camera: {
      screen: Camera
    }
  },
  {
    headerMode: "none",
    navigationOptions: {
      headerVisible: false
    },
    defaultNavigationOptions: {
      gesturesEnabled: false
    }
  }
);

const bottomNavigator = createBottomTabNavigator({
  Home: {
    screen: stackNavigator,
    animationEnabled: true,
    navigationOptions: () => ({
      title: "Home",
      tabBarPosition: "bottom",
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        navigation.navigate("Home");
        defaultHandler();
      },
      tabBarIcon: () => <AntDesign name="home" size={20} />
    })
  },
  CreateDeck: {
    screen: CreateDeck,
    animationEnabled: true,
    navigationOptions: () => ({
      tabBarPosition: "bottom",
      title: "Create Deck",
      tabBarVisible: false,
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        navigation.navigate("CreateDeck");
        navigation.setParams({ flashcards: null, title: null });
        defaultHandler();
      },
      tabBarIcon: () => <AntDesign name="plus" size={20} />
    })
  },
  Profile: {
    screen: Profile,
    animationEnabled: true,
    navigationOptions: () => ({
      tabBarPosition: "bottom",
      title: "Profile",
      tabBarIcon: () => <FontAwesome name="user" size={20} />
    })
  },
  Scan: {
    screen: FilePickerMenu,
    animationEnabled: true,
    navigationOptions: () => ({
      tabBarPosition: "bottom",
      title: "Scan",
      tabBarIcon: () => <Ionicons name="ios-qr-scanner" size={20} />
    })
  }
});

stackNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;

  // eslint-disable-next-line prefer-destructuring
  const routeName = navigation.state.routes[navigation.state.index].routeName;

  if (routeName === "CreateCard") {
    tabBarVisible = false;
  }

  if (routeName === "LessonsMenu") {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
    swipeEnabled: false
  };
};

const App = createAppContainer(bottomNavigator);

export default App;
