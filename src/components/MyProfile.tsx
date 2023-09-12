import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, useColorScheme, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import Total from './Total';
import LogoutConfirmation from './LogoutConfirmation';
import LanguageSelector from './LanguageSelector';
import Tenzimleme from './Tenzimleme';
import FavoritesScreen from '../FavoritesScreen';
import ContactScreen from '../screens/ContactScreen';
import Policy from './Policy';
import Terms from './Terms';
import EditCategoryScreen from './EditCategoryScreen';

const MyProfile = () => {
  const [profileButton, setProfileButton] = useState(1);
  const { t } = useTranslation();
  const isDarkMode = useColorScheme() === 'dark';
  const handlePress = (buttonNumber) => {
    setProfileButton(buttonNumber);
  };
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    // Perform logout action here
    setShowLogoutModal(false);
  };

  const buttonLabels = [
    'profile',
    'favorites',
    'settings',
    'log_out',
    'change',
    'contact_7',
    'mexfi',
    'istifadec',
    'edit',
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.innerContainer, { backgroundColor: isDarkMode ? "#1B1523" : '#F4F9FD' }]}>
        <View style={styles.buttonsContainer}>
          {buttonLabels.map((label, index) => (
            <Pressable
              key={index + 1}
              onPress={() => handlePress(index + 1)}
              style={[
                styles.card,
                { backgroundColor: isDarkMode ? "#1B1523" : 'white' },
                profileButton === index + 1 ? styles.activeCard : null,
              ]}
            >
              <Text
                style={[
                  styles.text,
                  profileButton === index + 1 ? styles.activeText : null,
                ]}
              >
                {t(label)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      {profileButton === 1 && <Total />}
      {profileButton === 2 && <FavoritesScreen />}
      {profileButton === 3 && <Tenzimleme />}
      {profileButton === 4 && <LogoutConfirmation
        visible={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />}
      {profileButton === 5 && <LanguageSelector />}
      {profileButton === 6 && <ContactScreen />}
      {profileButton === 7 && <Policy />}
      {profileButton === 8 && <Terms />}
      {profileButton === 9 && <EditCategoryScreen />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  innerContainer: {
    flex: 1,
    margin: 20,
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonsContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  card: {
    height: 60,
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    justifyContent: 'center',
  },
  activeCard: {
    backgroundColor: '#9559E5',
  },
  text: {
    color: "#9559E5",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 3,
  },
  activeText: {
    color: "white",
  },
});

export default MyProfile;
