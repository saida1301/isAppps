import { Dimensions, Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import React, { useState } from 'react';
import AddCvForm from './AddCvForm';
import MyCvs from './MyCvs';
import CvFavoritesScreen from '../CvFavoritesScreen';
import { useTranslation } from 'react-i18next';

const CvProfile = () => {
  const [profileButton, setProfileButton] = useState(1);
const isDarkMode = useColorScheme() === 'dark'
const {t} = useTranslation();
  const handlePress = (buttonNumber: React.SetStateAction<number>) => {
    setProfileButton(buttonNumber);
  };
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    // Perform logout action here
    setShowLogoutModal(false);
  };



  return (
    <View>
      <View style={[styles.containerBox, { backgroundColor: isDarkMode ? "#1B1523" : '#F4F9FD'},]}>
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
         {t('add_cv')}
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
      {t('cvler')}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => handlePress(3)}
          style={[
            styles.card,
            {backgroundColor: isDarkMode ? "#1B1523" : '#F4F9FD'},
 profileButton === 3 ? styles.activeCard : styles.card,
          ]}
        >
          <Text
            style={[
              styles.text,
              profileButton === 3 ? styles.activeText : styles.text,
            ]}
          >
  {t('liked')}
          </Text>
        </Pressable>
     
    
      </View>
      {profileButton === 1 && <AddCvForm/>}
      {profileButton === 2 && <MyCvs />}
      {profileButton === 3 && <CvFavoritesScreen />}
    </View>
  );
};

export default CvProfile;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 340,
    height: 60,
    borderRadius: 10,

    marginTop:10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activeCard:{
    width:"100%",
    maxWidth:340,
    height:60,
    borderRadius:10,
    backgroundColor:"#9559E5"

  },
  containerBox: {
    flexDirection:"column",
    alignItems:"center",
    marginHorizontal:20,
    marginVertical:20,
    columnGap:20,
alignSelf:"center",
    width:Dimensions.get('window').width - 40,
    height:230,
    borderRadius:10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
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