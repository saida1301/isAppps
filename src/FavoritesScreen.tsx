import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, FlatList, ActivityIndicator, useColorScheme, Pressable } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { borderRadius, colors, fontSizes, spacing } from './assets/themes';
import { useTranslation } from 'react-i18next';

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const isDarkMode = useColorScheme() === 'dark';
  const email = useSelector((state) => state.auth.email);
  const [user_id, setUserId] = useState('');
  const [likedVacanciesData, setLikedVacanciesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  
  const totalPages = Math.ceil(likedVacanciesData.length / itemsPerPage);

  // Fetch user ID from AsyncStorage or API if not available
  const fetchUserId = useCallback(async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      console.log('Stored userId:', storedUserId);
  
      if (storedUserId) {
        setUserId(parseInt(storedUserId, 10)); // Parse the storedUserId to an integer
      } else {
        const response = await axios.get('https://movieappi.onrender.com/user');
        console.log('API response:', response.data);
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
  }, [email]);
  
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  useEffect(() => {
    axios
      .get('https://movieappi.onrender.com/categories')
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('API call failed:', error);
      });

    axios
      .get('https://movieappi.onrender.com/companies')
      .then((response) => {
        setCompanies(response.data);
      })
      .catch((error) => {
        console.error('API call failed:', error);
      });

    // Fetch favorited vacancies when the component mounts
    fetchFavoritedVacancies();
  }, []);
  // Fetch favorited vacancies from the backend API
  const fetchFavoritedVacancies = useCallback(async () => {
    try {
      const userId = user_id;

      if (userId) {
        const response = await axios.get(`https://movieappi.onrender.com/favss/${userId}`);
        setLikedVacanciesData(response.data);
        console.log(response.data);
      }
    } catch (error) {
      console.log('Error fetching favorited vacancies:', error);
    } finally {
      setIsLoading(false); // Set loading state to false once data is fetched
    }
  }, [user_id]);

  useEffect(() => {
    fetchUserId();
  }, [fetchUserId]);

  useEffect(() => {
    if (isFocused) {
      setIsLoading(true); // Reset loading state to true before fetching data
      fetchFavoritedVacancies();
    }
  }, [isFocused, fetchFavoritedVacancies]);

  const handlePress = (vacancyId) => {
    navigation.navigate('VacancyInner', { vacancyId });
  };
  const handleHeartButtonPress = (vacancyId) => {
    handleRemoveFromFavorites(vacancyId);
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
  const handlePage = pageNumber => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  const handleRemoveFromFavorites = async (vacancyId) => {
    try {
      // Remove the vacancy from the likedVacanciesData state
      const updatedLikedVacancies = likedVacanciesData.filter((vacancy) => vacancy.id !== vacancyId);
      setLikedVacanciesData(updatedLikedVacancies);
  
      // Update the AsyncStorage to reflect the changes
      await AsyncStorage.setItem('likedVacancies', JSON.stringify(updatedLikedVacancies));
  
      // Make sure user_id and vacancyId are not undefined
      if (!user_id || !vacancyId) {
        console.error('User ID or Vacancy ID is undefined.');
        return;
      }
  
      // Make an API call to remove the vacancy from the server database
      await axios.delete(`https://movieappi.onrender.com/favorites/${user_id}/${vacancyId}`);
  
      console.log('Vacancy removed from favorites successfully.');
    } catch (error) {
      console.log('Error removing vacancy from favorites:', error.response?.data);
    }
  };
  
const {t} = useTranslation();
  const renderVacancyItem = ({ item }) => (
<Pressable onPress={() => handlePress(item.id)}>
<View style={[styles.card, { backgroundColor: isDarkMode ? '#0D0D0D' : '#FDFDFD' }]}>
      <View style={styles.vacancyBox}>
        <View style={styles.vacancyDetails}>
          <View style={styles.categoryContainer}>
            <View style={[styles.dot, { backgroundColor: '#8843E1' }]} />
            <Text style={styles.category}>
              {categories.find((category) => category.id === item.category_id)?.title_az}
            </Text>
          </View>

          <TouchableOpacity style={styles.heartButton} onPress={() => handleRemoveFromFavorites(item.id)}>
  {likedVacanciesData.some((likedVacancy) => likedVacancy.id === item.id) ? (
    <Image
      source={require('AwesomeProject/src/assets/images/heart3.png')}
      style={{
        width: 21, // Set the desired width
        height: 21,
        resizeMode: "contain", // Set the desired height
      }}
    />
  ) : (
    <FontAwesomeIcon icon={faHeart} size={21} color="#8843E1" />
  )}
</TouchableOpacity>

        </View>

        <View>
          <Text style={[styles.title, { color: isDarkMode ? '#FDFDFD' : '#020202' }, { maxWidth: '100%' }]}>
            {item.position}
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row' }}>
            <Image source={require('AwesomeProject/src/assets/images/buildingnew.png')} style={{ width: 15, height: 15, alignSelf:"center" }} />
                          <Text
  style={[
    styles.company,
    {
      color: isDarkMode ? '#FDFDFD' : '#C7C7C7',
      marginLeft: 4,
      width:200
    },
  ]}
  numberOfLines={3}
  ellipsizeMode="tail"
>
  {companies.find(company => company.id === item.company_id)?.name || 'Unknown Company'}
</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require('AwesomeProject/src/assets/images/timee.png')} style={{ width: 15, height: 15 }} />
              <Text style={[styles.createdDate, { color: isDarkMode ? '#FDFDFD' : '#0D0D0D', marginLeft: 4 }]}>
                {moment(item.created_at).format('DD.MM.YYYY')}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
</Pressable>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8843E1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
  <FlatList
  data={likedVacanciesData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
  renderItem={renderVacancyItem}
  keyExtractor={(item) => item.id.toString()}
/>

      <View style={{ marginBottom: 80 }}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          handlePage={handlePage}
        />
        <View style={{ alignSelf: 'center', paddingTop: 5 }}>
          <Text style={{ color:  isDarkMode ? '#fdfdfd' : "#00000", fontSize: 14, fontWeight: '600' }}>
          {t('total')}   {likedVacanciesData.length} 
          </Text>
        </View>
      </View>
    </View>
  );
  
};
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
    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
      {currentPage > 1 && (
        <TouchableOpacity onPress={() => handlePrevPage()}>
          <Text style={paginationStyles.text}>{'<'}</Text>
        </TouchableOpacity>
      )}

      {pageNumbers.map(pageNumber => {
        if (
          pageNumber === 1 ||
          pageNumber === currentPage ||
          pageNumber === totalPages ||
          (pageNumber > currentPage - 3 && pageNumber < currentPage + 3)
        ) {
          return (
            <TouchableOpacity key={pageNumber} onPress={() => handlePage(pageNumber)}>
              <Text
                style={{
                  backgroundColor: pageNumber === currentPage ? '#8843E1' : 'white',
                  fontSize: 16,
                  fontWeight: 'bold',
                  marginHorizontal: 8,
                  color: pageNumber === currentPage ? 'white' : 'black',
                  borderRadius: 5,
                  paddingHorizontal: 12,
                  paddingVertical: 7
                }}>
                {pageNumber}
              </Text>
            </TouchableOpacity>
          );
        } else if (pageNumber === currentPage - 3 || pageNumber === currentPage + 3) {
          return (
            <Text key={pageNumber} style={paginationStyles.text}>
              ...
            </Text>
          );
        }
      })}

      {currentPage < totalPages && (
        <TouchableOpacity onPress={() => handleNextPage()}>
          <Text style={paginationStyles.text}>{'>'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const paginationStyles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
});
const styles = StyleSheet.create({
  container: {
    padding: spacing.medium,
    marginBottom:70
  },
  card: {
    borderRadius: borderRadius.medium,
    padding: spacing.medium,
    marginBottom: spacing.medium,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,

  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecdbfc',
    padding: 7,
  },
  vacancyBox: {
    borderRadius: borderRadius.small,
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.small,
  },
  vacancyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.small,
  },
  dot: {
    width: spacing.small,
    height: spacing.small,
    borderRadius: borderRadius.small,
    marginRight: spacing.small,
    /* Example color for dot */
  },
  category: {
    fontWeight: 'bold',
    flexShrink: 1,
    /* Example color for category */
    color: '#8843E1',
  },
  heartButton: {
    marginLeft: 'auto',
    padding: spacing.small,
    borderRadius: borderRadius.small,
  },
  title: {
    fontSize: fontSizes.medium,
    fontWeight: 'bold',
    marginBottom: spacing.small,
  },
  company: {
    fontSize: fontSizes.small,
    fontWeight: 'bold',
  },
  createdDate: {
    fontSize: fontSizes.small,
  },
});

export default FavoritesScreen;