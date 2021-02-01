import { Logger } from 'payonkjs'
// import { ApolloClient, InMemoryCache } from '@apollo/client';
// import { gql } from '@apollo/client';

enum EventKeys {
  onLogin = 'onLogin',
  onLogout = 'onLogout',
  imageUpload = "imageUpload"
}

class StateStore {
  static SINGLETON: StateStore
  client: {}
  static SUBSCRIBERS: any
  static getInstance(): StateStore {
    if (this.SINGLETON !== undefined) {
      return this.SINGLETON
    } else {
      this.SINGLETON = new StateStore()
      return this.SINGLETON
    }
  }
  static subscribe(eventKey: string, callback: any): void {
    StateStore.SUBSCRIBERS = StateStore.SUBSCRIBERS || {}

    if (StateStore.SUBSCRIBERS[eventKey] !== undefined) {
      StateStore.SUBSCRIBERS[eventKey].push(callback)
    } else {
      StateStore.SUBSCRIBERS[eventKey] = []
      StateStore.SUBSCRIBERS[eventKey].push(callback)
    }
  }
  static publishEvent(eventKey, props): number {
    Logger.info(`Publishing ${eventKey} with props:`, props)

    if (StateStore.SUBSCRIBERS === undefined) {
      Logger.info("There aren't any registered subscribers for: ", eventKey)
      StateStore.SUBSCRIBERS = StateStore.SUBSCRIBERS || {}
    }

    if (StateStore.SUBSCRIBERS[eventKey] !== undefined) {
      StateStore.SUBSCRIBERS[eventKey].forEach(function(
        callbackFunction,
        index
      ) {
        try {
          let result = callbackFunction(props)
          Logger.info('Completed publish callback', result)
        } catch (error) {
          Logger.error(`A subscriber to user updates failed:`, error)
        }
      })
    } else {
      StateStore.SUBSCRIBERS[eventKey] = []
    }
    return StateStore.SUBSCRIBERS[eventKey].length
  }

  constructor() {
    // this.client = new ApolloClient({
    //     uri: 'https://api.whealthy.us/v1/graphql',
    //     cache: new InMemoryCache()
    // });
    this.client = {}
  }
}

export { StateStore, EventKeys }
