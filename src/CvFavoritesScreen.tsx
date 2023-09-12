import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, FlatList, ActivityIndicator, useColorScheme, Pressable, Dimensions } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { borderRadius, colors, fontSizes, spacing } from './assets/themes';
import { useTranslation } from 'react-i18next';
import { useLikedCv } from './LikedCvContex';

const CvFavoritesScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const isDarkMode = useColorScheme() === 'dark';
  const email = useSelector((state) => state.auth.email);
  const [user_id, setUserId] = useState('');
  const [likedVacanciesData, setLikedVacanciesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
console.log(likedVacanciesData)
  // Fetch user ID from AsyncStorage or API if not available
  const fetchUserId = useCallback(async () => {
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
  }, [email]);

  // Fetch favorited vacancies from the backend API
  const fetchLikedVacancies = useCallback(async () => {
    try {
      const response = await axios.get(`https://movieappi.onrender.com/fvrts/${user_id}`);
      setLikedVacanciesData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }, [user_id]);

  useEffect(() => {
    fetchUserId();
  }, [fetchUserId]);

  useEffect(() => {
    if (isFocused) {
      setIsLoading(true);
      fetchLikedVacancies();
    }
  }, [isFocused, fetchLikedVacancies]);

  const { likedCvData, likeCv, unlikeCv, fetchLikedCvFromApi, removeLikedCv } = useLikedCv();
  // Fetch favorited vacancies from the backend API
// Fetch favorited vacancies from the backend API
useEffect(() => {
  if (user_id) {
    fetchLikedCvFromApi(user_id);
  }
}, [user_id]);



  useEffect(() => {
    fetchUserId();
  }, [fetchUserId]);

  useEffect(() => {
    if (isFocused) {
      setIsLoading(true); // Reset loading state to true before fetching data

    }
  }, [isFocused]);


// CvFavoritesScreen.js



const handleFavoritePress = async (cvId) => {
  if (likedCvData.some((cv) => cv.id === cvId)) {
    unlikeCv(cvId); // Update the local likedCvData state
    await removeLikedCv(user_id, cvId); // Remove from API
    console.log('CV removed from favorites:', cvId);

    // Update the likedVacanciesData state by filtering out the removed CV
    setLikedVacanciesData((prevData) => prevData.filter((cv) => cv.id !== cvId));

    // Fetch the updated favorite vacancies from the backend
 
  }
};




  function chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const {t} = useTranslation()
  const totalPages = Math.ceil(likedVacanciesData.length / itemsPerPage);
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
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const renderVacancyItem = ({ item }) => (

<View
              style={[
                styles.card,
                { backgroundColor: isDarkMode ? '#131313' : 'white',  width: screenWidth * 0.4,
                height: screenHeight * 0.15,
       
                marginBottom: screenHeight * 0.03, },
              ]}
            >
   <TouchableOpacity style={styles.favoriteIcon} onPress={() => handleFavoritePress(item.id)}>
          <Image
        source={require('AwesomeProject/src/assets/images/heart3.png')}
        style={{
          width: 21, // Set the desired width
          height: 21,
          resizeMode:"contain",  // Set the desired height
        }}
      />
          </TouchableOpacity>
              <Image
                source={{ uri: `https://1is.az/${item?.image}` }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 35,
                  alignSelf: 'center',
                  bottom: 20,
                  backgroundColor: 'red',
                }}
              />
                            <Text style={styles.text}>{item.position}</Text>
              <Text style={[styles.text, { color: isDarkMode ? '#FDFDFD' : '#040F0F' }]}>
                {item.name} {item.surname}
              </Text>
              <Text style={[styles.text, { color: isDarkMode ? '#FDFDFD' : '#040F0F' }]}>
              ~  {item.salary}
              </Text>
            </View>

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
  {chunkArray(likedVacanciesData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), 2).map((row, rowIndex) => (
    <View key={rowIndex} style={styles.cardRow}>
      {row.map((item, index) => (
        <View key={index} style={styles.cardContainer}>
          {renderVacancyItem({ item })}
        </View>
      ))}
    </View>
  ))}
      <View style={{ marginBottom: 80 }}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          handlePage={handlePage}
        />
        <View style={{ alignSelf: 'center', paddingTop: 5 }}>
      
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
    flex: 1,
    padding: 10,
    marginHorizontal:20,

  },
  
  card: {
    width: 165,
    maxWidth: 200,
    height: 100,
    backgroundColor: colors.white,
    marginBottom: spacing.large,
    borderRadius: 10,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 20,
    elevation: 20,
    shadowOpacity: 1,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  
  cardContainer: {
    flex: 0.48, // Adjust this value as needed to create a 2 by 2 grid layout
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderColor: colors.primary,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
    position: 'absolute',
    bottom: 20,
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

export default CvFavoritesScreen;