import { Pressable, StyleSheet, Text, View, useColorScheme, Dimensions } from 'react-native';
import React, { useState } from 'react';
import MyProfile from './MyProfile';
import TelimAdd from './TelimAdd';
import { colors } from '../assets/themes';
import CompanyProfile from './CompanyProfile';
import CvProfile from './CvFile';
import { useTranslation } from 'react-i18next';

const ProfileButons = () => {
  const [profileButton, setProfileButton] = useState(1);
  const { t } = useTranslation();
  const isDarkMode = useColorScheme() === 'dark';
  const handlePress = (buttonNumber: React.SetStateAction<number>) => {
    setProfileButton(buttonNumber);
  };

  const deviceWidth = Dimensions.get('window').width;
  const cardWidth = deviceWidth * 0.39; // Adjust as needed

  return (
    <View style={{ backgroundColor: isDarkMode ? '#131313' : '#F4F9FD' }}>
      <View style={styles.containerBox}>
        <Pressable
          onPress={() => handlePress(1)}
          style={[
            styles.card,
            { backgroundColor: isDarkMode ? "#1B1523" : 'white' },
            profileButton === 1 ? styles.activeCard : styles.card,
            { width: cardWidth },
          ]}>
          <Text
            style={[
              styles.text,
              profileButton === 1 ? styles.activeText : styles.text,
            ]}>
            {t('umumi')}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => handlePress(2)}
          style={[
            styles.card,
            { backgroundColor: isDarkMode ? "#1B1523" : 'white' },
            profileButton === 2 ? styles.activeCard : styles.card,
            { width: cardWidth },
          ]}>
          <Text
            style={[
              styles.text,
              profileButton === 2 ? styles.activeText : styles.text,
            ]}>
            {t('trainings')}
          </Text>
        </Pressable>
      </View>
      <View style={styles.containerBox}>
        <Pressable
          onPress={() => handlePress(3)}
          style={[
            styles.card,
            { backgroundColor: isDarkMode ? "#1B1523" : 'white' },
            profileButton === 3 ? styles.activeCard : styles.card,
            { width: cardWidth },
          ]}>
          <Text
            style={[
              styles.text,
              profileButton === 3 ? styles.activeText : styles.text,
            ]}>
            {t('job_seeker')}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => handlePress(4)}
          style={[
            styles.card,
            { backgroundColor: isDarkMode ? "#1B1523" : 'white' },
            profileButton === 4 ? styles.activeCard : styles.card,
            { width: cardWidth },
          ]}>
          <Text
            style={[
              styles.text,
              profileButton === 4 ? styles.activeText : styles.text,
            ]}>
            {t('ish_goturen')}
          </Text>
        </Pressable>
      </View>
      {profileButton === 1 && <MyProfile />}
      {profileButton === 2 && <TelimAdd />}
      {profileButton === 3 && <CvProfile />}
      {profileButton === 4 && <CompanyProfile />}
    </View>
  );
};

export default ProfileButons;

const styles = StyleSheet.create({
  card: {
    height: 70,
    borderRadius: 10,
  },
  activeCard: {
    height: 70,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  containerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  text: {
    color: '#9559E5',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  activeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
});