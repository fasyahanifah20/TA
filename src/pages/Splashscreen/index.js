import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { tampilanutama1 } from '../../assets/image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Splashscreen = () => {
  const navigation = useNavigation();
  const [isSplashTimeout, setIsSplashTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashTimeout(true); // Setelah 3 menit, splash screen time out
    }, 1970);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
          navigation.replace('MainApp'); // Jika sudah login, langsung ke MainApp
        } else {
          // Jika belum login, tunggu input token selama 200 detik
          const tokenTimer = setTimeout(() => {
            navigation.replace('Loginscreen');
          }, 190);
          // Bersihkan timer saat komponen di-unmount atau ketika sudah login
          return () => clearTimeout(tokenTimer);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        navigation.replace('Loginscreen');
      }
    };

    if (isSplashTimeout) {
      checkLoginStatus(); // Setelah 3 menit, periksa status login
    }
  }, [isSplashTimeout, navigation]);

  return (
    <View style={styles.container}>
      <Image source={tampilanutama1} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default Splashscreen;
