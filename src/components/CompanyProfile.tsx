import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import React, { useState } from 'react';
import TelimAdd from './TelimAdd';
import Companies from './Companies';
import Vacancies from './Vacancies';
import CategoryItem from './CategoryItem';
import Total from './Total';
import Tenzimleme from './Tenzimleme';
import LogoutConfirmation from './LogoutConfirmation';

import LanguageSelector from './LanguageSelector';
import MyCompanies from './MyCompanies';
import UsersTable from './UsersTable';

import MyVacancies from './MyVacancies';
import AddCompanyModal from './AddCompanyModal';
import AddVacancyComponent from './AddVacancyComponent';
import { useTranslation } from 'react-i18next';

const CompanyProfile = () => {
  const [profileButton, setProfileButton] = useState(1);
  const [isModalVisible, setModalVisible] = useState(false);
const isDarkMode = useColorScheme() === 'dark'
const {t} = useTranslation();
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const addCompany = (companyData: any) => {
    // Handle the company data and add it to the app's state or perform any necessary operations
    console.log('Adding company:', companyData);
  };

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
      <View style={[styles.containerBox,    {backgroundColor: isDarkMode ? "#1B1523" : '#F4F9FD'},]}>
        <Pressable
          onPress={() => handlePress(1)}
          style={[
            styles.card,
           { backgroundColor: isDarkMode ? "#1B1523" : '#F4F9FD'},
            profileButton === 1 ? styles.activeCard : styles.card,
          ]}
        >
          <Text
            style={[
              styles.text,
              profileButton === 1 ? styles.activeText : styles.text,
            ]}
          >
        {t('companies')}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => handlePress(2)}
          style={[
            styles.card,
            { backgroundColor: isDarkMode ? "#1B1523" : '#F4F9FD'},
            profileButton === 2 ? styles.activeCard : styles.card,
          ]}
        >
          <Text
            style={[
              styles.text,
              profileButton === 2 ? styles.activeText : styles.text,
            ]}
          >
        {t('elan_yarat')}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => handlePress(3)}
          style={[
            styles.card,
            { backgroundColor: isDarkMode ? "#1B1523" : '#F4F9FD'},
            profileButton === 3 ? styles.activeCard : styles.card,
          ]}
        >
          <Text
            style={[
              styles.text,
              profileButton === 3 ? styles.activeText : styles.text,
            ]}
          >
      {t('elanlarim')}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            handlePress(4);
            setShowLogoutModal(true);
          }}
          style={[
            styles.card,
            { backgroundColor: isDarkMode ? "#1B1523" : '#F4F9FD'},
            profileButton === 4 ? styles.activeCard : styles.card,
          ]}
        >
          <Text
            style={[
              styles.text,
              profileButton === 4 ? styles.activeText : styles.text,
            ]}
          >
       {t('namizedler')}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            handlePress(5);
            toggleModal(); // Open the modal when pressing the button
          }}
          style={[
            styles.card,
            { backgroundColor: isDarkMode ? "#1B1523" : '#F4F9FD'},
            profileButton === 5 ? styles.activeCard : styles.card,
          ]}
        >
          <Text
            style={[
              styles.text,
              profileButton === 5 ? styles.activeText : styles.text,
            ]}
          >
      {t('sirket')}
          </Text>
        </Pressable>
      </View>
      {profileButton === 1 && <MyCompanies />}
      {profileButton === 2 && <AddVacancyComponent />}
      {profileButton === 3 && <MyVacancies />}
      {profileButton === 4 && <UsersTable />}
      {profileButton === 5 && (
        <AddCompanyModal
          isVisible={isModalVisible}
          closeModal={toggleModal}
          addCompany={addCompany}
        />
      )}
    </View>
  );
};

export default CompanyProfile;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 320,
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
    maxWidth:320,
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
    backgroundColor:"white",
    width:"100%",
    maxWidth:360,
    height:400,
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