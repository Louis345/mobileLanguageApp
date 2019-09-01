import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import ActionSheet from '../components/ActionSheet/ActionSheet';

export default class MenuStart extends React.PureComponent {
  state = {
    openPanel: false
  };
  render() {
    const actionSheetHeight = {
      top: Dimensions.get('window').height
    };
    return (
      <View style={{ flex: 1 }}>
        <Text>Menu Screen</Text>
        <TouchableOpacity
          onPress={() =>
            this.setState({
              openPanel: true
            })
          }
        >
          <Text>Start Quiz</Text>
          <ActionSheet animatePanel={this.state.openPanel} />
        </TouchableOpacity>
      </View>
    );
  }
}
