import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TextInput, Button, StyleSheet, Alert, Pressable, Text, useColorScheme, TouchableWithoutFeedback, Modal } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import SuccessAnimation from '../animations/success.json';
import LottieView from 'lottie-react-native';
const Tenzimleme = () => {
  const [userId, setUserId] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordAgain, setNewPasswordAgain] = useState('');
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordAgain, setShowNewPasswordAgain] = useState(false);
  const email = useSelector((state) => state.auth.email);
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        console.log('Stored userId:', storedUserId);
  
        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          // If userId is not found in AsyncStorage, fetch it from the API
          const response = await axios.get('https://movieappi.onrender.com/user');
          console.log('API response:', response.data);
          const data = response.data;
          const loggedInUser = data.find(user => user.email === email);
  
          if (loggedInUser) {
            setUserId(loggedInUser.id);
            // Save the fetched userId in AsyncStorage for future use
            await AsyncStorage.setItem('userId', loggedInUser.id.toString());
          } else {
            console.error('User not found!');
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchUserId();
  }, [email]);
  const handleSuccessModalClose = () => {
    setIsSuccessModalVisible(false);
  };
  const handlePasswordChangeSuccess = () => {
    setIsSuccessModalVisible(true);
    setOldPassword('');
    setNewPassword('');
    setNewPasswordAgain('');
  };
  const handleChangePassword = async () => {
    try {
      const response = await axios.post(
        'https://movieappi.onrender.com/changePassword',
        {
          userId,
          oldPassword,
          newPassword,
          newPasswordAgain,
        }
      );

      
    

      
      if (response.status === 200) {
        Alert.alert('Success', response.data.message);

      } else {
        Alert.alert('Error', response.data.message);
      }

    } catch (error) {
      console.log('Change Password Payload:', {
        userId,
        oldPassword,
        newPassword,
        newPasswordAgain,
      });
      console.error('Frontend Error:', error.response.data);
      Alert.alert('Error', 'An error occurred');
    }
    
  };
  const isDarkMode = useColorScheme() === 'dark';
const {t} = useTranslation();
return (
  <View style={styles.container}>
    <Text style={[styles.label,{ color: isDarkMode ? "white" : "black",}]}>{t('password')}</Text>
    <TextInput
        value={oldPassword}
        onChangeText={setOldPassword}
        secureTextEntry={!showOldPassword}
        style={styles.input}
      />
      <TouchableWithoutFeedback onPress={() => setShowOldPassword(!showOldPassword)}>
        <FontAwesome name={showOldPassword ? 'eye-slash' : 'eye'} size={24} color="gray" style={styles.eyeIcon} />
      </TouchableWithoutFeedback>


<Text style={[styles.label,{ color: isDarkMode ? "white" : "black",}]}>{t('new_password')}</Text>
<TextInput
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry={!showNewPassword}
        style={styles.input}
      />
      <TouchableWithoutFeedback onPress={() => setShowNewPassword(!showNewPassword)}>
        <FontAwesome name={showNewPassword ? 'eye-slash' : 'eye'} size={24} color="gray" style={styles.eyeIcons} />
      </TouchableWithoutFeedback>

    <Text style={[styles.label,{ color: isDarkMode ? "white" : "black",}]}>{t('new_password')}</Text>
    <TextInput
        value={newPasswordAgain}
        onChangeText={setNewPasswordAgain}
        secureTextEntry={!showNewPasswordAgain}
        style={styles.input}
      />
      <TouchableWithoutFeedback onPress={() => setShowNewPasswordAgain(!showNewPasswordAgain)}>
        <FontAwesome name={showNewPasswordAgain ? 'eye-slash' : 'eye'} size={24} color="gray" style={styles.eyeIconss} />
      </TouchableWithoutFeedback>

    <Pressable
      onPress={handleChangePassword}
      style={styles.button}
    >
      <Text style={styles.buttonText}>{t('aproved')}</Text>
    </Pressable>
    <Modal
        animationType="slide"
        transparent={true}
        visible={isSuccessModalVisible}
        onRequestClose={handleSuccessModalClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <LottieView
              source={SuccessAnimation}
              autoPlay
              loop={false}
              style={styles.animation}
            />
            <Text style={styles.successText}>{t('password_change_success_message')}</Text>
            <Button title={t('close')} onPress={handleSuccessModalClose} />
          </View>
        </View>
      </Modal>
  </View>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
},
modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
modalContent: {
  backgroundColor: 'white',
  borderRadius: 10,
  padding: 20,
  alignItems: 'center',
  elevation: 5,
},
animation: {
  width: 150,
  height: 150,
  marginBottom: 20,
},
successText: {
  fontSize: 18,
  marginBottom: 20,
},
label: {
  fontSize: 16,
  fontWeight: '600',
 
  marginHorizontal: 10,
  marginTop: 10,
  alignSelf: 'flex-start',
},
input: {
  backgroundColor: 'white',
  width: '100%',
  maxWidth: 370,
  height: 55,
  borderRadius: 10,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 1,
  },
  color: '#020202',
  marginLeft: 10,
  marginTop: 10,
},
eyeIcon: {
  position: 'absolute',
  right: 30, // Adjust this value to position the icon properly
  top: '22%',
  transform: [{ translateY: -12 }], // Adjust this value to center the icon vertically
},
eyeIcons: {
  position: 'absolute',
  right: 30, // Adjust this value to position the icon properly
  top: '45%',
  transform: [{ translateY: -12 }], // Adjust this value to center the icon vertically
},
eyeIconss: {
  position: 'absolute',
  right: 30, // Adjust this value to position the icon properly
  top: '70%',
  transform: [{ translateY: -12 }], // Adjust this value to center the icon vertically
},
button: {
  flexDirection: 'row',
  gap: 10,
  width: 105,
  height: 40,
  backgroundColor: '#8843E1',
  borderRadius: 10,
  justifyContent: 'center',
  alignSelf: 'center',
  marginTop: 20,
  marginBottom: 60,
  elevation: 5,
},
buttonText: {
  textAlign: 'center',
  color: '#FDFDFD',
  fontSize: 16,
  fontWeight: '500',
  alignItems: 'center',
  alignSelf: 'center',
},
});

export default Tenzimleme;