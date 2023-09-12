import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TextInput,
  ScrollView,
  useColorScheme,
} from 'react-native';
import axios from 'axios';
import CheckBox from '@react-native-community/checkbox';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, StoreType } from '../../store/store';
import { register } from '../../store/redux/authSlice';
import { borderRadius, colors, fontSizes, spacing } from '../../assets/themes';
import LoadingScreen from '../../components/LoadingScreen';
import { useTranslation } from 'react-i18next';

const Register = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const isDarkMode = useColorScheme();

  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isSurnameFocused, setIsSurnameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleEmailFocus = () => setIsEmailFocused(true);
  const handleEmailBlur = () => setIsEmailFocused(false);

  const handleNameFocus = () => setIsNameFocused(true);
  const handleNameBlur = () => setIsNameFocused(false);

  const handleSurnameFocus = () => setIsSurnameFocused(true);
  const handleSurnameBlur = () => setIsSurnameFocused(false);

  const handlePasswordFocus = () => setIsPasswordFocused(true);
  const handlePasswordBlur = () => setIsPasswordFocused(false);
  const [isLoading, setIsLoading] = useState(true);
  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get('https://movieappi.onrender.com/categories');
      setCategories(response.data);
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryChange = (category) => {
    const updatedSelectedCategories = [...selectedCategories];
    if (updatedSelectedCategories.includes(category)) {
      const index = updatedSelectedCategories.indexOf(category);
      updatedSelectedCategories.splice(index, 1);
    } else {
      updatedSelectedCategories.push(category);
    }
    setSelectedCategories(updatedSelectedCategories);
  };

  const handleSignup = () => {
    setIsLoading(true);
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      setIsLoading(false);
      return;
    }
    if (categories.length < 3) {
      setErrorMessage('Please select at least three categories');
      setIsLoading(false);
      return;
    }
  
    const selectedCategoryIds = categories
      .filter((category) => selectedCategories.includes(category.title_az))
      .map((category) => category.id.toString());
  
    const signupData = {
      name,
      surname,
      email,
      password,
      cat_id: selectedCategoryIds,
    };
  
    axios
      .post('https://movieappi.onrender.com/signup', signupData)
      .then((response) => {
        if (response.data.message === 'User already logged in') {
          // Handle the case where the user is already logged in
          // You can display a message to the user or navigate to a different screen
     navigation.navigate('login');
        } else {
          // User registration was successful, proceed with further actions
          const { token, cat_id } = response.data;
          // Do something with the token and cat_id
  
          // Navigate to the next screen or perform further actions
          navigation.navigate('login');
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Signup error:', error);
        setErrorMessage('Signup failed. Please try again.');
        setIsLoading(false);
      });
  };
  
  const {t} =useTranslation()
  if (isLoading) {
    return <LoadingScreen />;
  } else {
  return (
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode === 'dark' ? '#131313' : 'white' }]}>
      <Image source={require('AwesomeProject/src/assets/images/1İŞ.az.png')} style={styles.image} />

      <TextInput
        placeholder={t('email')}
        value={email}
        onChangeText={setEmail}
        onFocus={handleEmailFocus}
        onBlur={handleEmailBlur}
        style={[
          styles.input_container,
          {
            borderColor: isEmailFocused ? colors.primary : '#C5C6CC',
            color:isDarkMode === 'dark' ? "white" : "black"
          },
        ]}
        placeholderTextColor={isDarkMode === 'dark' ? "white" : "#8F9098"}
        keyboardType="email-address"
      />
      <TextInput
        placeholder={t('istifadeci')}
        onChangeText={setName}
        placeholderTextColor="#8F9098"
        onFocus={handleNameFocus}
        onBlur={handleNameBlur}
        style={[
          styles.input_container,
          {
            borderColor: isNameFocused ? colors.primary : '#C5C6CC',
          },
        ]}
      />
      <TextInput
        placeholder={t('istifadecisoy')}
        onChangeText={setSurname}
        placeholderTextColor="#8F9098"
        onFocus={handleSurnameFocus}
        onBlur={handleSurnameBlur}
        style={[
          styles.input_container,
          {
            borderColor: isSurnameFocused ? colors.primary : '#C5C6CC',
          },
        ]}
      />
      <TextInput
        secureTextEntry={true}
        onChangeText={setPassword}
        placeholder={t('sifre')}
        placeholderTextColor="#8F9098"
        onFocus={handlePasswordFocus}
        onBlur={handlePasswordBlur}
        style={[
          styles.input_container,
          {
            borderColor: isPasswordFocused ? colors.primary : '#C5C6CC',
          },
        ]}
      />
      <Text style={{ marginTop: 15, color: isDarkMode ? 'white' : '#C5C6CC' }}>
      {t('category')}
      </Text>
      <View style={styles.cardContainer}>
        {categories.map((category, index) => (
          <View key={category.id} style={[styles.categoryCard, index % 2 !== 0 && styles.categoryCardRight]}>
            <CheckBox
              value={selectedCategories.includes(category.title_az)}
              onValueChange={() => handleCategoryChange(category.title_az)}
            />
            <Text style={{ color: isDarkMode === 'dark' ? 'white' : '#C5C6CC' }}>{category.title_az}</Text>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={[styles.title, { color: isDarkMode === 'dark'? 'white' : '#C5C6CC' }]}> {t('hesab2')} </Text>
        <Pressable onPress={() => navigation.navigate('login')}>
          <Text style={[styles.title, { color: isDarkMode === 'dark' ? 'white' : '#C5C6CC' }]}>{t('daxil')}</Text>
        </Pressable>
      </View>
      <View style={{ width: '100%', padding: spacing.large }}>
        <Pressable onPress={handleSignup} style={styles.button}>
          <Text style={{ textAlign: 'center', color: 'white', fontSize: fontSizes.large }}>{t('qeyd')}</Text>
        </Pressable>
      </View>
      {errorMessage !== '' && <Text>{errorMessage}</Text>}

   
    </ScrollView>
  );}
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.large,
    paddingVertical: spacing.large,
    backgroundColor: colors.white,
  },
  input: {
    marginBottom: spacing.large,
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.medium,
    borderRadius: borderRadius.large,
    marginBottom:40
  },
  title: {
    fontSize: fontSizes.medium,
  },
  input_container: {
    borderRadius: borderRadius.small,
    fontSize: fontSizes.medium,
    borderColor: '#C5C6CC',
    borderWidth: 1,
 
    paddingHorizontal: spacing.medium,
    marginTop: 20,
    marginBottom: -10,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  categoryText: {
    fontSize: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  categoryCard: {
    width: '48%',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'lightgray',
    marginBottom: 10,
  },
  categoryCardRight: {
    marginLeft: '4%',
  },
});