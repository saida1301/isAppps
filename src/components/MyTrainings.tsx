import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  useColorScheme,
  TouchableOpacity,
  Dimensions, // Import Dimensions
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const MyTrainings = ({  }) => {
  const [companies, setCompanies] = useState([]);
  const [userId, setUserId] = useState('');
  const navigation = useNavigation();
  const email = useSelector((state) => state.auth.email);
  const isDarkMode = useColorScheme() === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState(companies);
  const screenWidth = Dimensions.get('window').width; // Get the screen width

  useEffect(() => {
    // Filter the companies based on the search term whenever it changes
    const filteredData = companies.filter((company) =>
      company.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCompanies(filteredData);
  }, [searchTerm, companies]);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://movieappi.onrender.com/training/${userId}`);
        setCompanies(response.data);
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userId]);

  const { t } = useTranslation();

  const handlePress = (telimId: number) => {
    navigation.navigate('TelimInner', {telimId});
    console.log(telimId)
  };

  const cardWidth = screenWidth * 0.9; // Set the card width based on the screen width

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity key={item.id} onPress={() => handlePress(item?.id)}>
        <View style={[styles.card, { width: cardWidth }]}>
          <Image source={{ uri: `https://1is.az/${item.image}` }} style={styles.image} />
        </View>
        <View style={{ flexDirection: "row", margin: 20, justifyContent: "space-between" }}>
          <Text style={[styles.company, { color: isDarkMode ? 'white' : 'black' }]}>{item.title}</Text>
          <Text style={[styles.price, { backgroundColor: item?.payment_type === '1' ? 'transparent' : 'green' }]}>
            {item?.payment_type === '1' ? (
              `${item?.price} azn`
            ) : (
              t('free')
            )}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: isDarkMode ? "#1B1523" : '#F4F9FD' }]}>
      <FlatList
        horizontal
        data={filteredCompanies}
        keyExtractor={(item) => item?.id?.toString()}
        renderItem={renderItem}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom:30
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    marginHorizontal: 10,
    borderRadius: 5,
    padding: 12,
    overflow: 'hidden', // Hide overflow content
  },
  image: {
    width: '100%',
    height: 320,

    borderRadius: 5,
  },
  company: {
    fontSize: 16,
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    color: 'white',
  },
});

export default MyTrainings;
