import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';

import reducers from './src/reducers';
import RootStack from './src/router';

console.disableYellowBox = true;

const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
const client = new ApolloClient({
	uri: 'https://api.graph.cool/simple/v1/cjjjjob8m30ul015677awn3le'
});

class App extends React.Component {
	render() {
		return (
			<ApolloProvider client={client}>
				<Provider store={store}>
					<RootStack />
				</Provider>
			</ApolloProvider>
		);
	}
}

export default App;
