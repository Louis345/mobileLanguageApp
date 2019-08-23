import React from 'react';
import { NavigationConsumer } from './navigation_context';

const withNavigationContextConsumers = BaseComponent =>
  class withNavigationContextConsumer extends React.PureComponent {
    render() {
      return (
        <NavigationConsumer>
          {({ selectedCardDeck, setSelectedCardDeck }) => {
            return (
              <BaseComponent
                selectedCardDeck={selectedCardDeck}
                setSelectedCardDeck={setSelectedCardDeck}
                {...this.props}
              />
            );
          }}
        </NavigationConsumer>
      );
    }
  };

export default withNavigationContextConsumers;
