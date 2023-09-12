import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable, useColorScheme, Image, ActivityIndicator, TextInput, Modal, FlatList, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleDown, faHeart } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthHeader from '../components/AuthHeader';
import { borderRadius, colors, fontSizes, spacing } from '../assets/themes';
import { addFavorite, removeFavorite } from '../store/redux/favoriteSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {  useLikedVacancy } from '../LikedVacanciesContext';
import { useTranslation } from 'react-i18next';
import LoadingScreen from '../components/LoadingScreen';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
const VacanciesScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [sortingOption, setSortingOption] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sortedCompanies, setSortedCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [showFinished, setShowFinished] = useState(false);
  const [userId, setUserId] = useState(null);
  const [totalVacancies, setTotalVacancies] = useState(0);
  const navigation = useNavigation();
  const totalItems = totalVacancies;
  const isDarkMode = useColorScheme() === 'dark';
  const totalPages = Math.ceil(totalVacancies / itemsPerPage);

  const email = useSelector(state => state.auth.email);
  const dispatch = useDispatch();

  const [cities, setCities] = useState([]);
  const { t } = useTranslation();

  const [selectedCity, setSelectedCity] = useState(
    cities.length > 0 ? cities[0].title_az : t('allCities')
  );
  


  console.log( "unubj",selectedCity)
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city.title_az);
    setModalVisible(false);
  };

  const filteredCities = cities.filter((city) =>
    city.title_az.toLowerCase().includes(searchText.toLowerCase())
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [likedVacancies, setLikedVacanciesData] = useState([])
  const fetchCities = async () => {
    try {
      const response = await axios.get('https://movieappi.onrender.com/cities');
      const data = response.data;

      setCities(data);
      setSelectedCity(data[0]?.id);
    } catch (error) {
      console.log('Error fetching cities:', error.message);
    }
  };

  const fetchVacancies = async () => {
    setIsLoading(true); // Set loading to true when starting the fetching process
  
    try {
      let pageSize;

      if (currentPage === 1) {
        pageSize = itemsPerPage; // Use itemsPerPage for the first page
      } else {
        pageSize = totalPages; // Use totalPages for other pages
      }
  
      const response = await axios.get('https://movieappi.onrender.com/vacancies', {
        params: {
          page: currentPage,
          pageSize: pageSize,
          showFinished: true,
          city_id: selectedCity === t('allCities') ? undefined : cities.find(city => city.title_az === selectedCity)?.id,
        },
      });
      const data = response.data;
  
      // Apply sorting based on the selected option
      let sortedData = data;
  
      if (sortingOption === 'a-to-z') {
        sortedData = data.slice().sort((a, b) => a.position.localeCompare(b.position));
      } else if (sortingOption === 'z-to-a') {
        sortedData = data.slice().sort((a, b) => b.position.localeCompare(a.position));
      } else if (sortingOption === 'views') {
        sortedData = data.slice().sort((a, b) => b.view - a.view);
      }
  
      setSortedCompanies(sortedData);
  
      // Update the current page after fetching and sorting the data
      setCurrentPage(currentPage);
    } catch (error) {
      console.log('Error fetching vacancies:', error.message);
    } finally {
      setIsLoading(false); // Set loading to false after fetching and sorting, regardless of success or error
    }
  };
  
  
  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://movieappi.onrender.com/categories');
      const data = response.data;
      setCategories(data);
    } catch (error) {
      console.log('Error fetching categories:', error.message);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await axios.get('https://movieappi.onrender.com/companies');
      const data = response.data;
      setCompanies(data);
    } catch (error) {
      console.log('Error fetching companies:', error.message);
    }
  };

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

  const fetchTotalVacancies = async () => {
    try {
      const response = await axios.get('https://movieappi.onrender.com/vacancies/total', {
        params: {
          showFinished: showFinished ? 0 : 1,
          createdAfter: showFinished ? moment().subtract(1, 'months').format() : undefined,
          city_id: selectedCity === t('allCities') ? undefined : cities.find(city => city.title_az === selectedCity)?.id,
        },
      });
      const totalVacancies = response.data.count;
  
      if (totalVacancies < 12) {
        setItemsPerPage(totalVacancies);
      } else {
        setItemsPerPage(12); // Set back to the default value if totalVacancies is not less than 12
      }
  
      setTotalVacancies(totalVacancies);
    } catch (error) {
      console.log('Error fetching total vacancies:', error.message);
    }
  };
  
  
  

  useEffect(() => {
    Promise.all([fetchCities(), fetchCategories(), fetchCompanies()])
      .then(() => {
        setIsLoading(false);
        setSelectedCity(cities.length > 0 ? cities[0].title_az :t('allCities'));
      })
      .catch(error => {
        console.log('Error fetching data:', error.message);
        setIsLoading(false);
      });
  
    fetchUserId();
    fetchTotalVacancies(); // Fetch total vacancies initially
  }, [email]);
  
  useEffect(() => {
    fetchVacancies();
    fetchTotalVacancies();
  }, [currentPage, sortingOption, selectedCity, showFinished]);
  
  
  

  useEffect(() => {
    fetchVacancies();
    fetchTotalVacancies() // Fetch vacancies initially
  }, [currentPage, sortingOption, selectedCity, showFinished]);

  const handleSortingChange = option => {
    setSortingOption(option);
    setShowFinished(false);
    setCurrentPage(1); // Reset the currentPage when changing sorting
    fetchVacancies(); // Fetch vacancies with the new sorting
  };
  const [isFavorite, setIsFavorite] = useState([]);

  const { likedVacanciesData, likeVacancy, unlikeVacancy, fetchLikedVacancyFromApi, removeLikedVacancy } = useLikedVacancy();
  useEffect(() => {
    if (userId) {
      fetchLikedVacancyFromApi(userId);
    }
  }, [userId]);
  const handleFavoritePress = async (vacancId: any) => {
    if (likedVacanciesData.some((vacancy: { id: any; }) => vacancy.id === vacancId)) {
      unlikeVacancy(vacancId); // Update the local likedCvData state
      await removeLikedVacancy(userId, vacancId); // Remove from API
      console.log('Vacancy removed from favorites:', vacancId);
    } else {
      likeVacancy({ id: vacancId }); // Update the local likedCvData state
      await axios.post('https://movieappi.onrender.com/fav', {
        user_id: userId,
        vacancy_id: vacancId,
      });
      console.log('Vacancy added to favorites:', vacancId);
    }
  }; // Fetch favorited vacancies when user_id changes
   // <-- Add likedVacanciess as a dependency
  

  

  const handleCheckboxChange = () => {
    setShowFinished(prev => !prev);
  };

  const handlePress = vacancyId => {
    navigation.navigate('VacancyInner', { vacancyId });
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
 

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sortedCompanies.length)  ;
  const visibleVacancies = sortedCompanies.slice(startIndex, endIndex);
  console.log('soerettretg',sortedCompanies.length);
  
  if (isLoading) {
    return <LoadingScreen />;
  } else {
  return (
    <ScrollView style={{ backgroundColor: isDarkMode ? '#131313' : '#F4F9FD', marginBottom: 40 }}>

        <>
          <AuthHeader title={t('work')} />
          <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',marginLeft:20   }}>
          <TouchableOpacity
  style={{
   
   
width:"100%",
    height: 60,
    justifyContent: 'center',
    backgroundColor: isDarkMode ? '#131313' : '#F4F9FD', 
      marginLeft:30,
left:30,
    paddingHorizontal:  Dimensions.get('window').width * 0.03,
    marginVertical:  Dimensions.get('window').height * 0.03,
    marginHorizontal:  Dimensions.get('window').width * 0.2,
    borderWidth: 2,
    borderColor: '#8843E1',
    borderRadius:  Dimensions.get('window').width * 0.04,
// Background color for dark mode
  }}
  onPress={() => setModalVisible(true)}
>
  <Text style={{ color: isDarkMode ? 'white' : 'black', }}>
    {selectedCity}
  </Text>
  <View style={{ width: 0, height: 0, borderTopWidth: 5, borderTopColor: 'gray', borderLeftWidth: 5, borderLeftColor: 'transparent', borderRightWidth: 5, borderRightColor: 'transparent', borderBottomWidth: 5, borderBottomColor: 'transparent', position: 'absolute', bottom: 20, left: '80%', marginLeft: -5 }} />

</TouchableOpacity>











  <Modal
    visible={modalVisible}
    animationType="slide"
    transparent={false}
    onRequestClose={() => setModalVisible(false)}
  >
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',  backgroundColor: isDarkMode ? '#131313' : '#F4F9FD', }}>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: isDarkMode ? 'white' : 'black',
          borderRadius: 5,
          paddingHorizontal: 10,
          height: 60,
          marginBottom: 20,
          marginTop: 20,
          width: '90%',
          fontSize: 16,
          color: isDarkMode ? 'white' : 'black',
          backgroundColor: isDarkMode ? '#333' : '#fff', // Background color for dark mode
        }}
        onChangeText={handleSearch}
        value={searchText}
        placeholderTextColor={isDarkMode ? 'white' : 'black'}
 
      />

      <FlatList
        data={filteredCities}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              paddingVertical: 10,
              paddingHorizontal: 16,
              width: '100%',
              alignSelf: 'center',
              backgroundColor: isDarkMode ? '#333' : '#fff', // Background color for dark mode
              borderBottomColor: isDarkMode ? 'gray' : 'lightgray', // Border color for dark mode
              borderBottomWidth: 1,
            }}
            onPress={() => handleCitySelect(item)}
          >
            <Text style={{ color: isDarkMode ? 'white' : 'black', fontSize: 16 }}>
              {item.title_az}
            </Text>
          </TouchableOpacity>
        )}
        style={{ width: '100%' }}
      />

      <TouchableOpacity
        style={{
          marginVertical: 10,
          backgroundColor: isDarkMode ? '#8843E1' : '#333', // Button background color for dark mode
          padding: 10,
          borderRadius: 5,
          width: '90%',
          alignItems: 'center',
        }}
        onPress={() => setModalVisible(false)}
      >
        <Text style={{ color: isDarkMode ? '#fff' : 'white', fontSize: 16 }}>
          {t('bagla')}
        </Text>
      </TouchableOpacity>
    </View>
  </Modal>
</View>


            <View style={[styles.pickerContainer, { flex: 1 }]}>
              <Picker selectedValue={sortingOption} onValueChange={handleSortingChange} style={[styles.pickerStyle, {color: isDarkMode ? 'white' : 'black'}]}>
                <Picker.Item label={t('new')} value="newest" />
                <Picker.Item label={t('a-z')} value="a-to-z" />
                <Picker.Item label={t('z-a')} value="z-to-a" />
                <Picker.Item label={t('count')} value="views" />
              </Picker>
            </View>
          </View>

          <View style={styles.checkboxContainer}>
            <TouchableOpacity style={[styles.checkbox, showFinished && styles.checkboxChecked]} onPress={handleCheckboxChange}>
              {showFinished && <View style={styles.checkboxInner} />}
            </TouchableOpacity>
            <Text style={[styles.checkboxLabel, {color: isDarkMode ? 'white' : 'black'}]}>{t('finished')}</Text>
          </View>

          <View style={styles.container}>
            {visibleVacancies.map(vacancy => (
              <Pressable key={vacancy.id} onPress={() => handlePress(vacancy.id)}>
                <View
                  style={[
                    styles.card,
                    {
                      backgroundColor: isDarkMode ? '#0D0D0D' : '#FDFDFD',
                   shadowColor: isDarkMode ? '#FFF' : '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: isDarkMode ? 0.5 : 0.2, // Adjust these values
shadowRadius: isDarkMode ? 3 : 1, // Adjust these values
elevation: isDarkMode ? 3 : 1, // Adjust these values

                    },
                  ]}
                >
                  <View style={styles.vacancyBox}>
                    <View style={styles.vacancyDetails}>
                      <View style={styles.categoryContainer}>
                        <View style={[styles.dot, { backgroundColor: '#8843E1' }]} />
                        <Text style={styles.category}>
                          {categories.find(category => category.id === vacancy.category_id)?.title_az}
                        </Text>
                      </View>
                      {/* <TouchableOpacity onPress={() => handleFavoritePress(vacancy.id)}>
              <MaterialIcon
                name={likedVacanciesData.includes(vacancy.id) ? 'heart' : 'heart-outline'}
                size={25}
                color={likedVacanciesData.includes(vacancy.id) ? 'red' : '#C7C7C7'}
              />
            </TouchableOpacity> */}
            <TouchableOpacity
                        onPress={handleFavoritePress.bind(null, vacancy.id)}

                      >
                     <Text style={[styles.button,{ color: isFavorite?.includes(vacancy.id) ? 'red' : '#C7C7C7' }]}>
  {likedVacanciesData?.some(v => v.id === vacancy.id) ? (
                            <Icon name="heart" size={25}  color={"red"} style={styles.button}/>
                          ) : (
                            <Icon name="heart-outline" size={25} style={styles.button} />
                          )}
  </Text>
                      </TouchableOpacity>
                    </View>

                    <View>
                    <Text style={[styles.title, { color: isDarkMode ? '#FDFDFD' : '#020202' }]} numberOfLines={2} ellipsizeMode="tail">{vacancy.position}</Text>


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
  {companies.find(company => company.id === vacancy.company_id)?.name || 'Unknown Company'}
</Text>

                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Image source={require('AwesomeProject/src/assets/images/timee.png')} style={{ width: 15, height: 15 }} />
                          <Text style={[styles.createdDate, { color: isDarkMode ? '#FDFDFD' : '#0D0D0D', marginLeft: 4 }]}>
                            {moment(vacancy.created_at).format('DD.MM.YYYY')}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>

          <View style={{ marginBottom: 80 }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              handleNextPage={handleNextPage}
              handlePrevPage={handlePrevPage}
              handlePage={handlePage}
            />
            <View style={{ alignSelf: 'center', paddingTop: 5 }}>
              <Text style={{ color: isDarkMode ? 'white' : 'black', fontSize: 14, fontWeight: '600' }}>{t('total')} {totalVacancies}</Text>
            </View>
          </View>
        </>
    
    </ScrollView>
  );}
};

export default VacanciesScreen;

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



const styles = StyleSheet.create({
  container: {
    paddingHorizontal:  Dimensions.get('window').width * 0.05,
    paddingVertical:  Dimensions.get('window').height * 0.02,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom:  Dimensions.get('window').width * 0.02,
    marginTop: - Dimensions.get('window').width * 0.02,
    marginHorizontal:  Dimensions.get('window').width * 0.1,
  },
  searchInput: {
    width: '80%',
    height:  Dimensions.get('window').height * 0.05,
    marginBottom:  Dimensions.get('window').width * 0.02,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal:  Dimensions.get('window').width * 0.02,
  },
  checkbox: {
    width:  Dimensions.get('window').width * 0.05,
    height:  Dimensions.get('window').width * 0.05,
    borderRadius:  Dimensions.get('window').width * 0.01,
    borderWidth: 2,
    borderColor: '#8843E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#8843E1',
  },
  pickerContainer: {
    paddingHorizontal:  Dimensions.get('window').width * 0.02,
    marginVertical:  Dimensions.get('window').height * 0.03,
    marginHorizontal:  Dimensions.get('window').width * 0.1,
    borderWidth: 2,
    borderColor: '#8843E1',
    borderRadius:  Dimensions.get('window').width * 0.04,
  },
  pickerStyle: {
    color: 'black',
  },
  checkboxInner: {
    width:  Dimensions.get('window').width * 0.012,
    height:  Dimensions.get('window').width * 0.012,
    borderRadius:  Dimensions.get('window').width * 0.002,
    backgroundColor: 'white',
  },
  checkboxLabel: {
    color: 'black',
    marginLeft:  Dimensions.get('window').width * 0.02,
  },
  card: {
    borderRadius:  Dimensions.get('window').width * 0.03,
    padding:  Dimensions.get('window').width * 0.02,
    marginBottom:  Dimensions.get('window').width * 0.02,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height:  Dimensions.get('window').width * 0.01,
    },
    shadowOpacity: 0.05,
    shadowRadius:  Dimensions.get('window').width * 0.02,
    elevation: 2,
    height:  Dimensions.get('window').height * 0.2,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecdbfc',
    padding:  Dimensions.get('window').height * 0.007,
  },
  vacancyBox: {
    borderRadius:  Dimensions.get('window').width * 0.01,
    paddingHorizontal:  Dimensions.get('window').width * 0.01,
    paddingVertical:  Dimensions.get('window').height * 0.01,
  },
  vacancyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom:  Dimensions.get('window').width * 0.02,
  },
  dot: {
    width:  Dimensions.get('window').width * 0.01,
    height:  Dimensions.get('window').width * 0.01,
    borderRadius:  Dimensions.get('window').width * 0.002,
    marginRight:  Dimensions.get('window').width * 0.02,
  },
  category: {
    fontWeight: 'bold',
    flexShrink: 1,
    color: '#8843E1',
  },
  button: {
    marginLeft: 'auto',
    padding:  Dimensions.get('window').width * 0.02,
    borderRadius:  Dimensions.get('window').width * 0.01,
  },
  title: {
    fontSize:  Dimensions.get('window').width * 0.05,
    fontWeight: 'bold',
    marginBottom:  Dimensions.get('window').width * 0.02,
  },
  company: {
    fontSize:  Dimensions.get('window').width * 0.03,
    fontWeight: 'bold',
  },
  createdDate: {
    fontSize:  Dimensions.get('window').width * 0.03,
  },
  showAllButton: {
    marginTop:  Dimensions.get('window').height * 0.1,
    alignItems: 'center',
    marginBottom:  Dimensions.get('window').height * 0.15,
    height:  Dimensions.get('window').height * 0.06,
    width:  Dimensions.get('window').width * 0.65,
    alignSelf: 'center',
  },
  showAllText: {
    color: 'white',
    backgroundColor: '#8843E1',
    padding:  Dimensions.get('window').width * 0.02,
    fontSize:  Dimensions.get('window').width * 0.05,
    fontWeight: 'bold',
  },
});