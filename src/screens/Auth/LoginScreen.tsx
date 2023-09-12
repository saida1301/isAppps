import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  useColorScheme,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useDispatch, useSelector } from 'react-redux';
import { login, loginAction } from '../../store/redux/authSlice';
import { setUser } from '../../store/redux/userSlice';
import { LoadingButton } from '../../components/Button';
import axios from 'axios';

import { borderRadius, colors, fontSizes, spacing } from '../../assets/themes';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome';
import LanguageSelector from '../../components/LanguageSelector';
const { width } = Dimensions.get('window');
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const inputWidth = width * 0.85;
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:'526513890144-eru4lqkdrt9ai5tm4qaq2ure48iarsq1.apps.googleusercontent.com',
      offlineAccess: true, // This is needed to get refresh tokens for authentication
    });
    checkLoggedInStatus();
  }, []);
  
//web 512785777219-o5a0q3m89krfgdd6pntrljl48fvo04f8.apps.googleusercontent.com
//android 512785777219-03jjnc4prlcqskmmj2q2jbbvrpt4sjqc.apps.googleusercontent.com

const checkLoggedInStatus = async () => {
  const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
  const isSwipeCompleted = await AsyncStorage.getItem('swipeCompleted');

  if (isLoggedIn === 'true' && isSwipeCompleted === 'true') {
    navigateToTabsScreen();
  } else if (isLoggedIn === 'true') {
    navigateToSwipeScreen();
  }
};

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleChangeUsername = (text: string) => {
    setEmail(text);
  };
  const { t } = useTranslation();
  const handleChangePassword = (text: string) => {
    setPassword(text);
  };

  const submit = async () => {
    setIsLoading(true);
  
    try {
      const response = await axios.post('https://movieappi.onrender.com/login', {
        email,
        password,
      });
  
      if (response.status === 200) {
        const { message, } = response.data;
        console.log(message);
  
        const {id} = response.data; 
        console.log("slam", id)// Make sure the key "id" exists in response data
        if (id !== undefined) {
          dispatch(
            loginAction.login({
              email,
              id,
            })
          );
  
          await AsyncStorage.setItem('isLoggedIn', 'true');
          await AsyncStorage.setItem('userId', id.toString());
          await AsyncStorage.setItem('swipeCompleted', 'false');
  console.log(id)
          navigateToSwipeScreen();
        } else {
          console.error('ID not found in response data');
          Alert.alert(t('login_error'));
        }
      } else {
        const { error } = response.data;
        console.log(error);
        Alert.alert(t('login_error'));
      }
    } catch (error) {
      Alert.alert(t('login_error'));
    }
  
    setIsLoading(false);
  };
  
  


  const navigateToSwipeScreen = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'swipe' }],
      })
    );
  };
  
  const navigateToTabsScreen = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Tabs' }],
      })
    );
  };
  const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      const userInfo = await GoogleSignin.signIn();
      const response = await axios.post(
        'https://movieappi.onrender.com/google-signin',
        {
          email: userInfo.user.email,
          givenName: userInfo.user.givenName,
          photo: userInfo.user.photo,
          familyName: userInfo.user.familyName,
        }
      );
  console.log(response.data)
      // Access the user object from the response
      const user = response.data.user;
      console.log("User ID:", user.id); // Access the user object from the response
      const userId = user.id;
      dispatch(setUser(user)); // Dispatch the user object to the Redux store
      dispatch(
        loginAction.login({
          email: user.email,
          id: user.id,
        })
      );
  
      // Save the fetched userId in AsyncStorage for future use
      await AsyncStorage.setItem('userId', userId.toString());
  
      navigateToSwipeScreen();
    } catch (error) {
      Alert.alert(t('google_login_error'));
      console.log(error)
    }
  };
  
  

  useEffect(() => {
    const checkSwipeCompletion = async () => {
      try {
        const isSwipeCompleted = await AsyncStorage.getItem('swipeCompleted');
        if (isSwipeCompleted === 'true') {
          console.log('Swipe process already completed. Navigating to Tabs screen.');
          navigateToTabsScreen(); // Navigate to the tabs screen
        }
      } catch (error) {
        console.log('Error checking swipe completion:', error);
      }
    };
  
    checkSwipeCompletion();
  }, []);
  
const isDarkMode = useColorScheme() === 'dark'

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, {backgroundColor : isDarkMode ? "black" : "white"}]}
    >
       <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={{alignSelf:"flex-end"}}>
      <LanguageSelector/>
      </View>
     <View style={styles.container}>

      <View style={styles.logoContainer}>
        <Image
          source={require('AwesomeProject/src/assets/images/1İŞ.az.png')}
          style={styles.logoImage}
        />
      </View>

      <View style={styles.formContainer}>
      <TextInput
            onChangeText={handleChangeUsername}
            placeholder={t('email')}
            style={[styles.input, { width: inputWidth ,borderColor: isDarkMode ? "white" : "black"}]} // Use the calculated width for the input
            placeholderTextColor={isDarkMode ? "white" : "black"}
            keyboardType="email-address"
          />
          <TextInput
            secureTextEntry={!showPassword}
            onChangeText={handleChangePassword}
            placeholder={t('sifre')}
            style={[styles.input, { width: inputWidth ,borderColor: isDarkMode ? "white" : "black"}]} // Use the calculated width for the input
            placeholderTextColor={isDarkMode ? "white" : "black"}
          />


<TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIconContainer}>
  <Icon
    name={showPassword ? 'eye' : 'eye-slash'}
    size={20}
    color={isDarkMode ? "white" : "black"}
  />
</TouchableOpacity>


<Pressable  onPress={() => navigation.navigate('forgot')}  style={{marginTop:20}}>
<Text style={{color:colors.primary, fontSize:14, fontWeight:600}}>{t('unut')}</Text>
</Pressable>


        <View style={styles.buttonContainer}>
          <LoadingButton
            onPress={submit}
            style={styles.buttonStyle}
            label={t('daxil')}
            loading={isLoading}
          />
        </View>
        <Text style={styles.errorText}>{errorMessage}</Text>
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>{t('hesab')}</Text>
          <Pressable onPress={() => navigation.navigate('signup')}>
            <Text style={[styles.registerLink, {color : isDarkMode ? "white" : "black"}]}>{t('signup')}</Text>
          </Pressable>
        </View>

        <View style={styles.divider} />
      </View>

      <TouchableOpacity style={styles.btnStyle} onPress={googleLogin}>
      <Icon name="google" size={20} color={isDarkMode ? "white" : "black"} />
    </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
 </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    position: 'absolute',
    width: 170,
    height: 60,
    
  },
  formContainer: {
    width: '100%',
    padding: 20,
    alignSelf: 'center',
    marginTop: 50,
  },
  input: {
    borderRadius: borderRadius.small,
    fontSize: fontSizes.medium,
    borderColor: colors.black + '60',
    borderWidth: 1,

    paddingHorizontal: spacing.medium,
    marginTop: 20,
    marginBottom: -10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  buttonStyle: {
    // Apply your button style here
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,

  },
  eyeIconContainer: {
    position: 'absolute',
    top: '40%',  // Adjusted to center vertically
    right: 40,
    transform: [{ translateY: -10 }]  // Move icon up by half of its height
  },
  
  registerText: {
    color: '#71727A',
    marginRight:12
  },
  registerLink: {
    color: 'black',
    marginRight: 12,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#D4D6DD',
    padding: 6,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnStyle: {
    height: 40,
    padding: 10,

    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
  },
});

export default LoginScreen;