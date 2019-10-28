import { AsyncStorage } from "react-native";

const api = {
  async getDeckList(key) {
    try {
      const cards = await AsyncStorage.getItem(key);

      return JSON.parse(cards);
    } catch (error) {
      // Error saving data
      return error;
    }
  },
  async setDeck(title, date, flashcards) {
    let isDeckSaved = null;
    const item = {
      title,
      date,
      flashcards
    };

    try {
      isDeckSaved = await AsyncStorage.setItem(title, JSON.stringify(item));
    } catch (error) {
      return error;
    }
    return isDeckSaved;
  },
  async getAllDecks() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const itemsArray = await AsyncStorage.multiGet(keys);

      const flashcardsDeck = itemsArray.reduce((acc, item) => {
        acc.push(JSON.parse(item[1]));
        return acc;
      }, []);

      return flashcardsDeck;
    } catch (error) {
      console.log(error, "error");
    }
  },
  getDecks() {
    const decks = AsyncStorage.getAllKeys();
    return decks;
  },
  checkSavedTitles(title) {
    const listPromise = AsyncStorage.getAllKeys();
    let status = null;
    listPromise.then(list => {
      status = list.findIndex(key => key === title);
      return status;
    });
  },
  removeNotificationSync(list) {
    const removedNotification = list.filter(items => {
      return items !== "flash_cards";
    });
    return removedNotification;
  },
  getDeckSize(callback) {
    const cardSize = [];
    AsyncStorage.getAllKeys((err, keys) => {
      // remove first key
      const filteredKeys = this.removeNotificationSync(keys);

      AsyncStorage.multiGet(filteredKeys, (err, stores) => {
        stores.map((result, i, store) => {
          // get at each store's key/value so you can work with it

          const key = store[i][0];
          const value = store[i][1];

          const parsedCard = JSON.parse(value);

          cardSize.push(parsedCard.question.length);
          callback(cardSize);
        });
      });
    });
  },
  deleteAllDecks() {
    AsyncStorage.clear();
  },
  removeDeck(title, callback) {
    try {
      AsyncStorage.removeItem(title, () => {
        callback();
      });
    } catch (error) {
      // Error saving data
      return error;
    }
  },
  async addCardToDeck(key, cardInfo) {
    const card = AsyncStorage.getItem(key);
    card.then(info => {
      const restoredCard = JSON.parse(info);
      restoredCard.question.push(cardInfo);
      AsyncStorage.setItem(key, JSON.stringify(restoredCard));
    });
  }
};
export default api;
