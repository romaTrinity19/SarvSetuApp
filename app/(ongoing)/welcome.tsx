import React, { useEffect } from 'react';
import { View, Image, StyleSheet, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WelcomeScreen: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const checkRegistration = async () => {
      const isRegistered = await AsyncStorage.getItem('isRegistered');

      setTimeout(() => {
        // if (isRegistered === 'true') {
          //router.replace('/(main)/Home'); // ✅ Registered users go to Home
        // } else {
          router.replace('/(auth)/register');  
        // }
      }, 5000); // 5 seconds delay
    };

    checkRegistration();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 150,
  },
});
