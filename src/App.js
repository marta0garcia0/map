import React from 'react';
import './App.scss';
import MapBox from './components/map-box/MapBox';
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://stuart-frontend-challenge.now.sh/graphql',
  cache: new InMemoryCache()
});
function App() {

  return (
    <ApolloProvider client={client}>
      <div className='App'>
        <MapBox />
      </div>
    </ApolloProvider>
  );
}

export default App;
