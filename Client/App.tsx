import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Login from './AllCode/LoginAndRegistration/Login';
import Home from './AllCode/Pages/Home';

// Import your dashboards
import AdminDashboard from './AllCode/Roles/Admin/AdminDashboard';
import EmployeeDashboard from './AllCode/Roles/Employee/EmployeeDashboard';

const Stack = createStackNavigator();

enableScreens(); // Optimize screens

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />

          {/* Add the dashboards here */}
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
          <Stack.Screen name="EmployeeDashboard" component={EmployeeDashboard} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;