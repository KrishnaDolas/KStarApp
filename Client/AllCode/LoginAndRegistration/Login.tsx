import React, { useState, useContext } from 'react';
import { View, TextInput, StyleSheet, Text, Alert, Image, TouchableOpacity } from 'react-native';
import { AuthContext } from '../Auths/LoginAuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../Config/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import KstarLogo from '../Assets/KStarLogo.png';
import { jwtDecode } from 'jwt-decode';

type LoginScreenProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface JwtPayload {
  role: 'admin' | 'employee';
  // add other fields if needed
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<'admin' | 'employee'>('employee'); // role state
  const [userType, setUserType] = useState<'admin' | 'employee'>('employee'); // for API endpoint choice

  const authContext = useContext(AuthContext);
  const navigation = useNavigation<LoginScreenProp>();

  // Check if environment variable exists
 const API_URL = process.env.REACT_APP_API_URL;
  if (!API_URL) {
    console.error('REACT_APP_API_URL is not defined. Please check your .env file.');
  }

  const handleLogin = async () => {
  console.log('handleLogin started with email:', email, 'userType:', userType);
  if (!email || !password) {
    console.log('Missing email or password');
    Alert.alert('Error', 'Please enter email and password');
    return;
  }

  // Determine API endpoint based on selected role
  const endpoint =
    userType === 'admin'
      ? `${API_URL}/api/v1/auth/adminLogin`
      : `${API_URL}/api/v1/auth/employeeLogin`;
  console.log('Using endpoint:', endpoint);

  try {
    console.log('Sending fetch request...');
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    console.log('Response received, status:', response.status);

    const responseText = await response.text();
    console.log('Raw response text:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Parsed response data:', data);
    } catch (err) {
      console.error('Failed to parse JSON response:', responseText);
      Alert.alert('Error', 'Invalid server response');
      return;
    }

    if (response.ok && data.token) {
      console.log('Login successful, token received:', data.token);
      await AsyncStorage.setItem('token', data.token);

      // Decode token to get user info
      try {
        const decodedToken = jwtDecode<JwtPayload>(data.token);
        const userRole = decodedToken.role;
        console.log('Decoded token, user role:', userRole);

        // Optional: update auth context
        if (authContext && authContext.signIn) {
          authContext.signIn(data.token);
        }

        // Navigate based on role
        if (userRole === 'admin') {
          console.log('Navigating to AdminDashboard');
          navigation.navigate('AdminDashboard');
        } else if (userRole === 'employee') {
          console.log('Navigating to EmployeeDashboard');
          navigation.navigate('EmployeeDashboard');
        } else {
          console.log('Navigating to fallback DrawerNavigator');
          navigation.navigate('DrawerNavigator'); // fallback
        }
      } catch (decodeError) {
        console.error('Error decoding token:', decodeError);
        Alert.alert('Error', 'Failed to decode token');
      }
    } else {
      const errorMsg = data.error || 'Login failed';
      console.log('Login failed:', errorMsg);
      Alert.alert('Login Failed', errorMsg);
    }
  } catch (error) {
    console.error('Network or other error during login:', error);
    Alert.alert('Error', 'Something went wrong. Please try again.');
  }
};

  return (
    <View style={styles.container}>
      {/* Logo at the top center */}
      <Image source={KstarLogo} style={styles.logo} />

      {/* Form container */}
      <View style={styles.formContainer}>
        {/* Role Selection */}
        <Text style={styles.label}>Select Role:</Text>
        <View style={styles.radioContainer}>
          {/* Admin Radio Button */}
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => {
              setRole('admin');
              setUserType('admin');
              console.log('Role set to admin');
            }}
          >
            <View style={styles.radioCircle}>
              {role === 'admin' && <View style={styles.selectedRb} />}
            </View>
            <Text style={styles.radioText}>Admin</Text>
          </TouchableOpacity>

          {/* Employee Radio Button */}
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => {
              setRole('employee');
              setUserType('employee');
              console.log('Role set to employee');
            }}
          >
            <View style={styles.radioCircle}>
              {role === 'employee' && <View style={styles.selectedRb} />}
            </View>
            <Text style={styles.radioText}>Employee</Text>
          </TouchableOpacity>
        </View>

        {/* Email Input */}
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          value={email}
          onChangeText={(text) => {
            console.log('Email input changed:', text);
            setEmail(text);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password Input */}
        <Text style={styles.label}>Password:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          value={password}
          onChangeText={(text) => {
            console.log('Password input changed:', text);
            setPassword(text);
          }}
          secureTextEntry
        />

        {/* Login Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            console.log('Login button pressed');
            handleLogin();
          }}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles object
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 220,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007bff',
  },
  radioText: {
    fontSize: 16,
    color: '#555',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 15,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Login;