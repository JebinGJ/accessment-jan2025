/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { routes } from './src/service/routes';
import { AuthScreen } from './src/screens/AuthScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { RegistrationScreen } from './src/screens/RegistrationScreen';
import { Provider } from 'react-redux';
import { store } from './src/redux/Store';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={routes.AUTH_SCREEN}
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name={routes.AUTH_SCREEN} component={AuthScreen} />
        <Stack.Screen name={routes.HOME_SCREEN} component={HomeScreen} />
        <Stack.Screen name={routes.REGISTRATION_SCREEN} component={RegistrationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
}


export default App;
