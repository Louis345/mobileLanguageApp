import React from "react";

export const NavigationContext = React.createContext({});

export class NavigationContextProvider extends React.Component {
  state = {
    selectedCardDeck: 0,
    hasUserAttemptedToExitQuiz: false,
    selectedDeckLength: null
  };

  setSelectedCardDeck = (name, deckSize) => {
    this.setState({
      selectedCardDeck: name,
      selectedDeckLength: deckSize
    });
  };

  render() {
    const { selectedCardDeck, selectedDeckLength } = this.state;

    return (
      <NavigationContext.Provider
        value={{
          selectedCardDeck,
          setSelectedCardDeck: this.setSelectedCardDeck,
          selectedDeckLength: selectedDeckLength
        }}
      >
        {this.props.children}
      </NavigationContext.Provider>
    );
  }
}

export const NavigationConsumer = NavigationContext.Consumer;
