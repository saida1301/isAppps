import { Dimensions, Image, Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import React, { useState } from 'react';
import TelimAdd from './TelimAdd';
import Companies from './Companies';
import Vacancies from './Vacancies';
import CategoryItem from './CategoryItem';
import Total from './Total';
import Tenzimleme from './Tenzimleme';
import LogoutConfirmation from './LogoutConfirmation';

import AddTrainingComponent from './AddTrainingComponent';
import MyProfile from './MyProfile';
import MyTrainings from './MyTrainings';
import { useTranslation } from 'react-i18next';

const TelimProfile = () => {
  const [profileButton, setProfileButton] = useState(1);
const isDarkMode = useColorScheme() === 'dark';
  const handlePress = (buttonNumber: React.SetStateAction<number>) => {
    setProfileButton(buttonNumber);
  };
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    // Perform logout action here
    setShowLogoutModal(false);
  };

const {t} = useTranslation();

  return (
    <View>
      <View style={[styles.containerBox,  {backgroundColor: isDarkMode ? "#1B1523" : '#F4F9FD'},]}>
        <Pressable
           onPress={() => handlePress(1)}
          style={[
            styles.card,
            {backgroundColor: isDarkMode ? "#1B1523" : '#F4F9FD'},
            profileButton === 1 ? styles.activeCard : styles.card,
          ]}
        >

          <Text
            style={[
              styles.text,
              profileButton === 1 ? styles.activeText : styles.text,
            ]}
          >
      {t('add_telim')}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => handlePress(2)}
          style={[
            styles.card,
            {backgroundColor: isDarkMode ? "#1B1523" : '#F4F9FD'},
 profileButton === 2 ? styles.activeCard : styles.card,
          ]}
        >
 
          <Text
            style={[
              styles.text,
              profileButton === 2 ? styles.activeText : styles.text,
            ]}
          >
          {t('siyahi')}
          </Text>
        </Pressable>

     
    
      </View>
      {profileButton === 1 && <AddTrainingComponent />}
      {profileButton === 2 &&  <MyTrainings/>}
 
    </View>
  );
};

export default TelimProfile;

const styles = StyleSheet.create({
    card: {
        width: '90%', // 90% of the screen width
        maxWidth: 300,
        height: 0.15 * Dimensions.get('window').width, // 10% of the screen width
        borderRadius: 0.02 * Dimensions.get('window').width, // 2% of the screen width
    
        marginTop: 0.02 * Dimensions.get('window').width, // 2% of the screen width
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0.01 * Dimensions.get('window').width }, // 1% of the screen width
        shadowOpacity: 0.25,
        shadowRadius: 0.015 * Dimensions.get('window').width, // 1.5% of the screen width
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
      activeCard: {
        width: '90%', // 90% of the screen width
        maxWidth: 300,
        height: 0.15 * Dimensions.get('window').width, // 10% of the screen width
        borderRadius: 0.02 * Dimensions.get('window').width, // 2% of the screen width
        backgroundColor: '#9559E5',
    
        marginTop: 0.02 * Dimensions.get('window').width, // 2% of the screen width
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0.01 * Dimensions.get('window').width }, // 1% of the screen width
        shadowOpacity: 0.25,
        shadowRadius: 0.015 * Dimensions.get('window').width, // 1.5% of the screen width
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
  containerBox: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: '5%', // 5% of the screen width on both sides
    marginVertical: Dimensions.get('window').height * 0.02, // 2% of the screen height top and bottom
    width: '90%', // 90% of the screen width
    maxWidth: 370,
    minHeight: Dimensions.get('window').height * 0.25, // Minimum height as a percentage of the screen height
    justifyContent: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text:{
    color: "#9559E5",
    fontSize:14,
    fontWeight:"600",
    textAlign:"center",
    alignSelf:"center",
    alignItems:"center",
    justifyContent:"center",
    margin: 20
  },
  activeText:{
    color: "white",
    fontSize:14,
    fontWeight:"600",
    textAlign:"center",
    alignSelf:"center",
    alignItems:"center",
    justifyContent:"center",
    margin: 20
   
  }
});