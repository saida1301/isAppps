import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  useColorScheme,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing } from '../assets/themes';

const MyCvs = ({ route }: any) => {
  const [companies, setCompanies] = useState([]);
  const [userId, setUserId] = useState('');
  const email = useSelector((state) => state.auth.email);
  const navigation = useNavigation();
  const isDarkMode = useColorScheme() === 'dark';

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
          const loggedInUser = data.find((user) => user.email === email);

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
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://movieappi.onrender.com/civ/${userId}`);
        setCompanies(response.data);
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userId]);

  const handlePress = (cvId: any) => {
    navigation.navigate('CvInner', { cvId });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

        {companies.map((company, index) => (
          <Pressable onPress={() => handlePress(company.id)} key={index}>
            <View
              style={[
                styles.card,
                {   marginLeft: index % 2 === 0 ? 0 : 5, backgroundColor: isDarkMode ? '#131313' : '#fdfdfd', width: screenWidth * 0.4,
                height: screenHeight * 0.15,
                shadowColor: isDarkMode ? '#FFF' : '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDarkMode ? 0.8 : 0.3,
                shadowRadius: isDarkMode ? 4 : 2,
                elevation: isDarkMode ? 5 : 2,
                marginBottom: screenHeight * 0.03, },
              ]}
            >
                 <Image
                        source={{ uri: `https://1is.az/${company?.image}` }}
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 35,
                          alignSelf: 'center',
                          top: 1,
                          backgroundColor: 'red',
                        }} />
              <Text style={[styles.text, { color: isDarkMode ? '#FDFDFD' : '#040F0F' }]}>
                {company.name} {company.surname}
              </Text>
              <Text style={styles.text}>{company.position}</Text>
            </View>
          </Pressable>
        ))}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 20,
    columnGap: 10,

  },
  companyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  card: {
    width: 165,
    maxWidth: 200,
    height: 100,
    backgroundColor: colors.white,
    marginBottom: spacing.large,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25, // Set borderRadius to half of the width or height for a circular shape
    alignSelf: 'center',
    bottom: 20,
    backgroundColor: 'red',
  },
  text: {
    marginTop: 10,
    color: '#040F0F',
    textAlign:"center"
  },
});

export default MyCvs;
