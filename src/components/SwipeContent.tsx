import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Text, Pressable, Image, Alert, useColorScheme } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import LoadingScreen from './LoadingScreen';
import { colors } from '../assets/themes';
import { useTranslation } from 'react-i18next';
import { useLikedVacancy } from '../LikedVacanciesContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const SwipeContent = ({ selectedCategories }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const translateX = new Animated.Value(0);
  const [companies, setCompanies] = useState([]);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const email = useSelector((state) => state.auth.email);
  const { likedVacanciesData, likeVacancy, unlikeVacancy , removeLikedVacancy} = useLikedVacancy();
  const [swipeCompleted, setSwipeCompleted] = useState(false);
const [user_id, setUserId] = useState([])
const isDarkMode = useColorScheme() === 'dark'
  useEffect(() => {
    fetchCompanies();
    fetchUserId();

    checkSwipeCompletion();
    fetchVacancies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get('https://movieappi.onrender.com/companies');
      setCompanies(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserId = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');

      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        const response = await axios.get('https://movieappi.onrender.com/user');
        const data = response.data;
        const loggedInUser = data.find(user => user.email === email);

        if (loggedInUser) {
          setUserId(loggedInUser.id);
          await AsyncStorage.setItem('userId', loggedInUser.id.toString());
        } else {
          console.error('User not found!');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };



  const checkSwipeCompletion = async () => {
    try {
      const isSwipeCompleted = await AsyncStorage.getItem('swipeCompleted');
      if (isSwipeCompleted === 'true') {
        setSwipeCompleted(true);
      }
    } catch (error) {
      console.log('Error checking swipe completion:', error);
    }
  };

  const fetchVacancies = async () => {
    try {
      const response = await axios.post('https://movieappi.onrender.com/vacancy', {
        userId: user_id,
        limit: 20,
      });
      setVacancies(response.data);
      setLoading(false);
    } catch (error) {
      console.log('Error fetching vacancies:', error.response.data);
    }
  };

  const handleSwipeEvent = ({ nativeEvent }) => {
    const { translationX, state } = nativeEvent;

    if (state === State.END) {
      if (translationX > 0) {
        handleLikeVacancy();
      } else {
        handleDislikeVacancy();
      }

      translateX.setValue(0);
      setCurrentIndex(currentIndex + 1);

      if (currentIndex + 1 >= vacancies.length) {
        setSwipeCompleted(true);
        AsyncStorage.setItem('swipeCompleted', 'true')
          .then(() => {
            console.log('Swipe process completed. Navigating to Tabs screen.');
            navigation.navigate('Tabs');
          })
          .catch((error) => {
            console.log('Error saving swipe completion:', error);
          });
      }
    }
  };
  const handleFavoritePress = async (vacancId: any) => {
    if (likedVacanciesData.some((vacancy: { id: any; }) => vacancy.id === vacancId)) {
      unlikeVacancy(vacancId); // Update the local likedCvData state
      await removeLikedVacancy(user_id, vacancId); // Remove from API
      console.log('Vacancy removed from favorites:', vacancId);
    } else {
      likeVacancy({ id: vacancId }); // Update the local likedCvData state
      await axios.post('https://movieappi.onrender.com/fav', {
        user_id: user_id,
        vacancy_id: vacancId,
      });
      console.log('Vacancy added to favorites:', vacancId);
    }
  };
  const handleLikeVacancy = async () => {
    if (currentIndex >= vacancies.length - 1) {
      setSwipeCompleted(true);
      AsyncStorage.setItem('swipeCompleted', 'true')
        .then(() => {
          console.log('No more vacancies. Swipe process completed. Navigating to Tabs screen.');
          navigation.navigate('Tabs');
        })
        .catch((error) => {
          console.log('Error saving swipe completion:', error);
        });
      return;
    }
  
    const currentVacancy = vacancies[currentIndex];
    const vacancyId = currentVacancy.id;
  
    console.log('Handling like/dislike for vacancy:', currentVacancy.position);
  
    try {
      await handleFavoritePress(vacancyId);
  
      Animated.timing(translateX, {
        toValue: 500,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        translateX.setValue(0);
        setCurrentIndex(currentIndex + 1);
        console.log('Swiped right. Moving to the next vacancy.');
      });
    } catch (error) {
      console.error('Error handling favorite press:', error);
    }
  };
  
  

  const handleDislikeVacancy = () => {
    if (currentIndex >= vacancies.length - 1) {
      setSwipeCompleted(true);
      AsyncStorage.setItem('swipeCompleted', 'true')
        .then(() => {
          console.log('No more vacancies. Swipe process completed. Navigating to Tabs screen.');
          navigation.navigate('Tabs');
        })
        .catch((error) => {
          console.log('Error saving swipe completion:', error);
        });
      return;
    }

    Animated.timing(translateX, {
      toValue: -500,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      translateX.setValue(0);
      setCurrentIndex(currentIndex + 1);
    });
  };



  const getCompanyName = (companyId) => {
    const company = companies.find((c) => c.id === companyId);
    return company ? company.name : '';
  };
const {t} = useTranslation()
  const handlePress = (vacancyId) => {
    navigation.navigate('VacancyInner', { vacancyId });
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (swipeCompleted) {
    return null;
  }
  function decodeHTMLEntities(text) {
    var entities = [
      ['amp', '&'],
      ['apos', "'"],
      ['#x27', "'"],
      ['#x2F', '/'],
      ['#39', "'"],
      ['#47', '/'],
      ['lt', '<'],
      ['gt', '>'],
      ['nbsp', ' '],
      ['quot', '"'],
      ['uuml', 'ü'],
      ['ouml', 'ö'],
      ['ccedil', 'ç'],
      ['Uuml', 'Ü'],
    ];

    var tagsToRemove = ['ul', 'li', 'span', 'style', 'font', 'p', 'o:p', 'style', 'br', 'a','div', 'h4', 'strong', 'ol'];

    for (var i = 0, len = entities.length; i < len; i++) {
      text = text?.replace(
        new RegExp('&' + entities[i][0] + ';', 'g'),
        entities[i][1]
      );
    }

    // Remove specified tags
    for (var i = 0, len = tagsToRemove.length; i < len; i++) {
      text = text?.replace(
        new RegExp('<' + tagsToRemove[i] + '[^>]*>', 'g'),
        ''
      );
      text = text?.replace(
        new RegExp('</' + tagsToRemove[i] + '>', 'g'),
        ''
      );
    }

    return text;
  }
  return (
    <View style={[styles.container, {backgroundColor : isDarkMode ? "black" : "#f3f3f3"}]}>
      <PanGestureHandler
        onGestureEvent={Animated.event([{ nativeEvent: { translationX: translateX } }], {
          useNativeDriver: true,
        })}
        onHandlerStateChange={handleSwipeEvent}
      >
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ translateX: translateX }],
              backgroundColor: isDarkMode? "#131313" : "white"
            },
          ]}
        >
          <Text style={[styles.title, {color : isDarkMode? "white" : "black"}]} numberOfLines={4} ellipsizeMode="tail">
            {vacancies[currentIndex]?.position}
          </Text>

          <Text style={[styles.company, { color: isDarkMode ? "white" : "black" }]}>
  {decodeHTMLEntities(getCompanyName(vacancies[currentIndex]?.company_id))}
</Text>


          <Pressable style={styles.button} onPress={() => handlePress(vacancies[currentIndex]?.id)}>
            <Text style={styles.buttonText}>{t("etrafli")}</Text>
          </Pressable>
        </Animated.View>
      </PanGestureHandler>

      <PanGestureHandler
        onGestureEvent={Animated.event([{ nativeEvent: { translationX: translateX } }], {
          useNativeDriver: true,
        })}
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state !== State.ACTIVE) {
            handleSwipeEvent({ nativeEvent });
          }
        }}
        shouldCancelWhenOutside={false}
        activeOffsetX={[-5, 5]}
        activeOffsetY={[-5, 5]}
      >
    <View style={styles.buttonsContainer}>
      <Pressable
        style={[
          styles.button2,
          styles.dislikeButton,
          { backgroundColor: isDarkMode ? '#1B1523' : 'white' },
        ]}
        onPress={handleDislikeVacancy}
      >
        <Icon name="close" size={30} color="red" />
      </Pressable>
      <Pressable
        style={[
          styles.button2,
          styles.likeButton,
          { backgroundColor: isDarkMode ? '#1B1523' : 'white' },
        ]}
        onPress={handleLikeVacancy}
      >
        <Icon name="heart" size={30} color="green" />
      </Pressable>
    </View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button2: {
    padding: 20,
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',

    marginRight: '10%',
    marginLeft: '10%',
  },
  dislikeButton: {},
  likeButton: {},
  card: {
    width: '80%',
    height: '50%',
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 5,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginVertical: 10,
    maxWidth: '80%',
  },
  company: {
    fontSize: 24,
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    padding: 10,
    width: '40%',
    borderRadius: 25,
    alignItems: 'center',
    backgroundColor: '#8843E1',
    justifyContent: 'center',
    position: 'absolute',
    bottom: '5%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    marginTop: 30,
  },
  buttonImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});

export default SwipeContent;