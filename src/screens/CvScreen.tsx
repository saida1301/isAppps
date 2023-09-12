import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  useColorScheme,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import CvCarusel from '../components/CvCarusel';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '../assets/themes';
import AuthHeader from '../components/AuthHeader';

import axios from 'axios';

import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import LoadingScreen from '../components/LoadingScreen';
import { addFavorite, removeFavorite } from '../store/redux/favoriteSlice';
import { useLikedCv } from '../LikedCvContex';
const CvScreen = () => {
  const navigation = useNavigation();
  const [cv, setcv] = useState([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'newest'>('asc');
  const isDarkMode = useColorScheme() === 'dark';
  const itemsPerPage = 8;
  const totalItems = cv.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const [likedVacanciesdata, setLikedVacanciesData] = useState([])
  useEffect(() => {
    axios
      .get(`https://movieappi.onrender.com/cv`)
      .then(response => {
        setcv(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('API call failed:', error);
        setIsLoading(false);
      });
  }, []);

  const handlePress = (cvId: string) => {
    navigation.navigate('CvInner', { cvId });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePage = (pageNumber: any) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  const handleSort = (order: 'asc' | 'desc' | 'newest') => {
    if (order === 'newest') {
      // Sort by newest first (based on a date property, for example, if you have one in your data)
      // Replace 'dateProperty' with the actual property name representing the date in your CV data
      const sortedCv = [...cv].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setcv(sortedCv);
    } else {
      const sortedCv = [...cv].sort((a, b) => {
        const nameA = `${a.name} ${a.surname}`.toLowerCase();
        const nameB = `${b.name} ${b.surname}`.toLowerCase();
        return order === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      });
      setcv(sortedCv);
    }
    setSortOrder(order);
  };

  const visibleCompanies = cv.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const [isFavorite, setIsFavorite] = useState([]);

  const [userId, setUserId] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedVacancies, setLikedVacancies] = useState([]);
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
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const { likedCvData, likeCv, unlikeCv, fetchLikedCvFromApi, removeLikedCv } = useLikedCv();
  useEffect(() => {
    if (userId) {
      fetchLikedCvFromApi(userId);
    }
  }, [userId]);
  const handleFavoritePress = async (cvId) => {
    if (likedCvData.some((cv) => cv.id === cvId)) {
      unlikeCv(cvId); // Update the local likedCvData state
      await removeLikedCv(userId, cvId); // Remove from API
      console.log('CV removed from favorites:', cvId);
    } else {
      likeCv({ id: cvId }); // Update the local likedCvData state
      await axios.post('https://movieappi.onrender.com/favorite', {
        user_id: userId,
        cv_id: cvId,
      });
      console.log('CV added to favorites:', cvId);
    }
  };
  
  
  if (isLoading) {
    return <LoadingScreen />;
  } else {
  return (
    <ScrollView style={{ backgroundColor: isDarkMode ? '#131313' : '#F4F9FD' }}>

      <><><AuthHeader title={t('baxilanlar')} textColor={isDarkMode ? 'white' : 'black'} /><CvCarusel /><View style={styles.pickerContainer}>
            <Picker
              selectedValue={sortOrder}
              onValueChange={(itemValue) => handleSort(itemValue)}
          
              mode="dropdown"
              style={[styles.picker, { width: '100%', color: isDarkMode ? 'white' : 'black' }]}
            >
              <Picker.Item label={t('a-z')} value="asc" />
              <Picker.Item label={t('z-a')} value="desc" />
              <Picker.Item label={t('new')} value="newest" />
            </Picker>
          </View><View style={styles.container}>

              {visibleCompanies.map((item, index) => (
                <>
                  <Pressable key={item.id} onPress={() => handlePress(item.id)}>
                    <View
                      style={[
                        styles.card,
                        {
                          marginLeft: index % 2 === 0 ? 0 : 5, backgroundColor: isDarkMode ? '#131313' : '#fdfdfd', width: screenWidth * 0.4,
                          height: screenHeight * 0.15,
                          shadowColor: isDarkMode ? '#FFF' : '#000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: isDarkMode ? 0.8 : 0.3,
                          shadowRadius: isDarkMode ? 4 : 2,
                          elevation: isDarkMode ? 5 : 2,
                          marginBottom: screenHeight * 0.03,
                        },
                      ]}
                    >
                      <Image
                        source={{ uri: `https://1is.az/${item?.image}` }}
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 35,
                          alignSelf: 'center',
                          bottom: 20,
                          backgroundColor: 'red',
                        }} />
                      <Text style={[styles.text, { color: isDarkMode ? '#FDFDFD' : '#040F0F' }]}>{item.position}</Text>
                      <Text style={[styles.text, { color: isDarkMode ? '#FDFDFD' : '#040F0F' }]}>
                        {item.name} {item.surname}
                      </Text>
                      <Text style={[styles.text, { color: isDarkMode ? '#FDFDFD' : '#040F0F' }]}>
                        ~  {item.salary}
                      </Text>
                      <TouchableOpacity
                        onPress={handleFavoritePress.bind(null, item.id)}

                      >
                     <Text style={[styles.button,{ color: isFavorite?.includes(item.id) ? 'red' : '#C7C7C7' }]}>
  {likedCvData?.some(v => v.id === item.id) ? (
                            <Icon name="heart" size={25}  color={"red"} style={styles.button}/>
                          ) : (
                            <Icon name="heart-outline" size={25} style={styles.button} />
                          )}
  </Text>
                      </TouchableOpacity>
                    </View>

                  </Pressable>
                </>
              ))}
            </View></><View style={{ marginBottom: 80 }}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                handleNextPage={handleNextPage}
                handlePrevPage={handlePrevPage}
                handlePage={handlePage} />
              <View style={{ alignSelf: 'center', paddingTop: 5 }}>

                <Text style={{ color: isDarkMode ? '#FDFDFD' : '#020202', fontSize: 14, fontWeight: '600' }}>
                  {' '}
                  {t('total')}     {totalItems}
                </Text>
              </View>
            </View></>
  

    </ScrollView>
  );}
};

export default CvScreen;




const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 10,
    columnGap: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  box: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 60,
    height: 60,
    borderRadius: 10,
  },
  text: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
    marginLeft: 10,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  paginationButton: {
    backgroundColor: '#B298D3',
    borderRadius: 5,
    padding: 8,
  },
  paginationButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 2,
    marginVertical: 30,
    marginHorizontal: 30,
    borderWidth: 2,
    borderColor: '#8843E1',
    borderRadius: 12,
  },
  labelContainer: {
    flex: 1,

    alignContent:"center" , 
    marginTop:20
  },
  pickerLabel: {
    color: 'black',
    fontSize: 16,
  },
  picker: {
    flex: 2, // Take 2/3 of the available space
    color: 'black',
    fontSize: 16,
  },
  pickerItem: {
    color: '#652AB0',
  },
  button: {
    position: 'absolute',
    bottom:0,
    right: 10,
    marginLeft:20
  },
  buttonText: {
    color: colors.primary,
  },
  buttonMore: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: -10,
  },
  buttontext: {
    color: colors.white,
  },
});
const Pagination = ({
  currentPage,
  totalPages,
  handleNextPage,
  handlePrevPage,
  handlePage,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  
  return (
    <View
      style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
      {currentPage > 1 && (
        <TouchableOpacity onPress={() => handlePrevPage(currentPage - 1)}>
          <Text style={paginationStyles.text}>{'<'}</Text>
        </TouchableOpacity>
      )}
      {pageNumbers.map((pageNumber) => {
        if (
          pageNumber === 1 ||
          pageNumber === currentPage ||
          pageNumber === totalPages ||
          (pageNumber > currentPage - 3 && pageNumber < currentPage + 3)
        ) {
          return (
            <TouchableOpacity
              key={pageNumber}
              onPress={() => handlePage(pageNumber)}>
              <Text
                style={[
                  paginationStyles.text,
                  pageNumber === currentPage
                    ? paginationStyles.activeText
                    : paginationStyles.inactiveText,
                ]}>
                {pageNumber}
              </Text>
            </TouchableOpacity>
          );
        } else if (
          (pageNumber === currentPage - 4 && currentPage > 4) ||
          (pageNumber === currentPage + 4 && currentPage < totalPages - 3)
        ) {
          return (
            <Text key={pageNumber} style={paginationStyles.text}>
              ...
            </Text>
          );
        }
      })}
      {currentPage < totalPages && (
        <TouchableOpacity onPress={() => handleNextPage(currentPage + 1)}>
          <Text style={paginationStyles.text}>{'>'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const paginationStyles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 8,
    color: '#8843E1',
    borderRadius: 5,
  },
  activeText: {
    backgroundColor: '#8843E1',
    color: 'white',
    paddingHorizontal: 5,
    paddingVertical: 7,
    borderRadius: 5,
  },
  inactiveText: {
    backgroundColor: 'white',
    color: 'black',
    paddingHorizontal: 5,
    paddingVertical: 7,
    borderRadius: 5,
  },
});

