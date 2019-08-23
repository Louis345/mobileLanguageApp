import React from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import Router from './router/Router';
import { NavigationContextProvider } from './context/navigation_context';

export default class App extends React.PureComponent {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <NavigationContextProvider>
          <Router />
        </NavigationContextProvider>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
