import React from 'react';

export const NavigationContext = React.createContext({});

export class NavigationContextProvider extends React.Component {
  state = {
    selectedCardDeck: 2
  };

  setSelectedCardDeck = name => {
    this.setState({
      selectedCardDeck: name
    });
  };
  render() {
    const { selectedCardDeck } = this.state;

    return (
      <NavigationContext.Provider
        value={{
          selectedCardDeck,
          setSelectedCardDeck: this.setSelectedCardDeck
        }}
      >
        {this.props.children}
      </NavigationContext.Provider>
    );
  }
}

export const NavigationConsumer = NavigationContext.Consumer;
