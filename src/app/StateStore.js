import Logger from './Logger';
import { ApolloClient, InMemoryCache } from '@apollo/client';
// import { gql } from '@apollo/client';

class StateStore {
    constructor() {
        // this.client = new ApolloClient({
        //     uri: 'https://api.whealthy.us/v1/graphql',
        //     cache: new InMemoryCache()
        // });
        this.client = {};
    }

    healthcheck() {
        this.client
            .query({
                query: gql`
      query GetRates {
        rates(currency: "USD") {
          currency
        }
      }
    `
            })
            .then(result => console.log(result));

    }

}

StateStore.subscribe = function (eventKey, callback) {
    StateStore.SUBSCRIBERS = StateStore.SUBSCRIBERS || {};

    if (StateStore.SUBSCRIBERS[eventKey] !== undefined) {
        StateStore.SUBSCRIBERS[eventKey].push(callback);
    } else {
        StateStore.SUBSCRIBERS[eventKey] = [];
        StateStore.SUBSCRIBERS[eventKey].push(callback);
    }
}

StateStore.publishEvent = function (eventKey, props) {

    Logger.info(`Publishing ${eventKey} with props:`, props);

    if (StateStore.SUBSCRIBERS === undefined) {
        Logger.info("There haven't been any registered subscribers");
        StateStore.SUBSCRIBERS = StateStore.SUBSCRIBERS || {};
    }

    if (StateStore.SUBSCRIBERS[eventKey] !== undefined) {
        StateStore.SUBSCRIBERS[eventKey].forEach(function (callbackFunction, index) {
            try {
                let result = callbackFunction(props);
                Logger.info('Completed publish callback', result);
            } catch (error) {
                Logger.error(`A subscriber to user updates failed:`, error);
            }
        });
    } else {
        StateStore.SUBSCRIBERS[eventKey] = [];
    }
    return StateStore.SUBSCRIBERS[eventKey].length;
}

StateStore.eventKeys = ['onLogin'];

export default StateStore