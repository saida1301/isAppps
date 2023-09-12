import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, useColorScheme, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { borderRadius, spacing } from '../assets/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLikedVacancies } from '../LikedVacanciesContext';
import { addFavorite, removeFavorite } from '../store/redux/favoriteSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const Card = ({ item }) => {
  const [isFavorite, setIsFavorite] = useState([]);
  const isDarkMode = useColorScheme() === 'dark';
  const [userId, setUserId] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedVacancies, setLikedVacancies] = useState([]);
  const [cvData, setCvData] = useState([]);

  useEffect(() => {
    axios
      .get('https://movieappi.onrender.com/cv/view-more-than-50')
      .then((response) => {
        setCvData(response.data);
      })
      .catch((error) => {
        console.error('API call failed:', error);
      });
  }, []);
  
  const email = useSelector((state) => state.auth.email);
  const { likedVacanciesData, likeVacancy } = useLikedVacancies();
  const [likedVacanciesdata, setLikedVacanciesData] = useState([])
  const dispatch = useDispatch();
  const addToFavoritesOnServer = async (userId, cvId) => {
    try {
      await axios.post('https://movieappi.onrender.com/fav', {
        user_id: userId,
        cv_id: cvId,
      });
      console.log('Vacancy added to favorites on the server:', cvId);
    } catch (error) {
      console.log('Error adding vacancy to favorites on the server:', error.message);
    }
  };

  const handleFavoritePress = async cvId => {
    const isAlreadyFavorite = isFavorite?.includes(cvId);
  
    if (!userId) {
      console.log('User ID is missing or invalid.');
      return;
    }
  
    try {
      if (isAlreadyFavorite) {
        await axios.delete(`https://movieappi.onrender.com/fav/${cvId}`);
        console.log('Vacancy removed from favorites on the server:', cvId);
      } else {
        await addToFavoritesOnServer(userId, cvId);
        console.log('Vacancy added to favorites on the server:', cvId);
      }
  
      // Update the favorites list in Redux store
      dispatch(isAlreadyFavorite ? removeFavorite(cvId) : addFavorite(cvId));
  
      // Update the liked vacancies context
      if (isAlreadyFavorite) {
        const updatedLikedVacancies = likedVacanciesData.filter(v => v.id !== cvId);
        setLikedVacanciesData(updatedLikedVacancies);
      } else {
        const vacancyToAdd = cvData.find(v => v.id === cvId);
        likeVacancy(vacancyToAdd);
      }
    } catch (error) {
      console.log('Error adding/removing vacancy to/from favorites:', error.message);
    }
  };
  
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

  
  return (
    <View style={[styles.card, { backgroundColor: isDarkMode ? '#131313' : 'white' }]}>
      <Image source={{ uri: `https://1is.az/${item?.image}` }} style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: 'red', alignSelf: "center", marginRight: 12 }} />
  <View style={{flexDirection:"column"}}>
  <Text style={{ color: isDarkMode ? 'white' : 'black'  }}>{item.name} {item.surname}</Text>
      <Text style={{ color: isDarkMode ? 'white' : 'black' }}>{item.position}</Text>
  </View>
 
  <TouchableOpacity onPress={() => handleFavoritePress(item.id)} style={{marginLeft:30}}>
  <Text style={{ color: isFavorite?.includes(item.id) ? 'red' : '#C7C7C7' }}>
  {likedVacanciesData.some(v => v.id === item.id) ? (
                            <Icon name="heart" size={25}  color={"red"}/>
                          ) : (
                            <Icon name="heart-outline" size={25} />
                          )}
  </Text>
</TouchableOpacity>
<Text style={{  justifyContent:"flex-end", alignSelf:"center", marginLeft:30, color: isDarkMode ? 'white' : 'black', }}>{item.salary}</Text>
    </View>
  );
};

const CvCarusel = () => {
  const cardWidth = 350;
  const spacing = 12;
  const containerWidth = cardWidth + spacing * 0.2;
  const [cvData, setCvData] = useState([]);

  useEffect(() => {
    axios
      .get('https://movieappi.onrender.com/cv/view-more-than-50')
      .then((response) => {
        setCvData(response.data);
        console.log(response.data)
      })
      .catch((error) => {
        console.error('API call failed:', error.response.data);
      });
  }, []);
  

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
      style={{ flex: 1, marginTop: 20 }}
    >
      {cvData.map((item) => (
        <View style={[styles.cardContainer, { width: containerWidth }]} key={item.id}>
          <Card item={item} />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 10,
  },
  cardContainer: {
    marginHorizontal: 5,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
    paddingHorizontal: 12,
    width: 350,
    height: 67,
    borderRadius: 61,
    borderColor: '#0D0D0D',
    borderWidth: 1,
  },
  button: {
    marginLeft: 'auto',
    padding: spacing.small,
    borderRadius: borderRadius.small,
  },
});

export default CvCarusel;