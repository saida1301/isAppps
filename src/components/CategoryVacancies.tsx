import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, Pressable, Image } from 'react-native';
import { borderRadius, colors, fontSizes, spacing } from '../assets/themes';

import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { addFavorite, removeFavorite } from '../store/redux/favoriteSlice';
import { useTranslation } from 'react-i18next';
import LoadingScreen from './LoadingScreen';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useLikedVacancy } from '../LikedVacanciesContext';
const CategoryVacancies = () => {
  const [vacancies, setvacancies] = useState([]);
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();
  const route = useRoute();
const [categoryvacancy, setcategoryvacancy] = useState([])
  const [categories, setcategories] = useState([])
  const [companies, setcompanies] = useState([])
  const [showAllVacancies, setShowAllVacancies] = useState(false);
  const [isFavorite, setIsFavorite] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
 
  const totalItems = categoryvacancy.length;
  const [users,setUsers] = useState([]);
  const [userId,setUserId] = useState();
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const email = useSelector((state) =>state.auth.email );
  const id = useSelector((state) =>state.auth.id );

  // console.log(email)
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

  const visibleVacancies = categoryvacancy.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );


 // Adjust the page size as needed

  useEffect(() => {
    setIsLoading(true);
    let pageSize;
  
    if (currentPage === 1) {
      pageSize = itemsPerPage;
    } else {
      pageSize = totalPages;
    }
  
    axios
      .get(`https://movieappi.onrender.com/vacancies?page=${currentPage}&pageSize=${pageSize}`)
      // Adjust URL and query parameters to match your backend
      .then(response => {
        setvacancies(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('API call failed:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentPage]);


  
  const categoryId = route.params?.categoryId ?? null;
  
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`https://movieappi.onrender.com/categories`)
      .then(response => {
        setcategories(response.data);
      })
      .catch(error => {
        console.error('API call failed:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`https://movieappi.onrender.com/companies`)
      .then(response => {
        setcompanies(response.data);
      })
      .catch(error => {
        console.error('API call failed:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  
  useEffect(() => {
    let pageSize;
  
    if (currentPage === 1) {
      pageSize = itemsPerPage;
    } else {
      pageSize = totalPages;
    }
  
    axios
      .get(`https://movieappi.onrender.com/vacancie/${categoryId}`, {
        params: {
          page: currentPage,
          pageSize: pageSize,
        },
      })
      .then(response => {
        setcategoryvacancy(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('API call failed:', error);
        setIsLoading(false);
      });
  }, [categoryId, currentPage, itemsPerPage, totalPages]);
  
  
  
  const fetchUsers = async () => {
    const response = await axios.get('https://movieappi.onrender.com/user');
    const data = await response.data;

    let indexOfUser;
    indexOfUser = data.find(item => item.email === email);
    setUserId(indexOfUser?.id);
  }

  useEffect(() => {
    fetchUsers();
  }, [])
  const dispatch = useDispatch();
  const {t} = useTranslation();


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
  };
  const handlePress = (vacancyId: string) => {
    navigation.navigate('VacancyInner', {vacancyId});
  };
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <LoadingScreen />;
  } else {
  return (
    <ScrollView >
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#0D0D0D' : 'white' }]}>
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
              <Text style={[styles.title, { color: isDarkMode ? '#FDFDFD' : '#020202' }]}>{vacancy.position}</Text>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row' }}>
                <Image
    source={require('AwesomeProject/src/assets/images/buildingnew.png')}
    style={{ width: 15, height: 15,  alignSelf:"center" }}
  />
                    <Text
  style={[
    styles.company,
    {
      color: isDarkMode ? '#FDFDFD' : '#C7C7C7',
      marginLeft: 4,
      width:200
    },
  ]}
  numberOfLines={2}
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
           <View style={{marginBottom: 80}}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          handlePage={handlePage}
        />
        <View style={{alignSelf: 'center', paddingTop: 5}}>
 
        </View>
      </View>
      </View>
   
    </ScrollView>
  );}
};

export default CategoryVacancies;

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
      style={{flexDirection: 'row', justifyContent: 'center', marginTop: 16}}>
      {currentPage > 1 && (
        <TouchableOpacity onPress={() => handlePrevPage(currentPage - 1)}>
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
            <TouchableOpacity
              key={pageNumber}
              onPress={() => handlePage(pageNumber)}>
              <Text
                style={{
                  backgroundColor:
                    pageNumber === currentPage ? '#8843E1' : 'white',
                  fontSize: 16,
                  fontWeight: 'bold',
                  marginHorizontal: 8,
                  color:  pageNumber === currentPage ? 'white' : 'black',
                  borderRadius: 5,
                  paddingHorizontal: 12,
                  paddingVertical:7
                }}>
                {pageNumber}
              </Text>
            </TouchableOpacity>
          );
        } else if (
          pageNumber === currentPage - 6 ||
          pageNumber === currentPage + 6 ||
          pageNumber === currentPage - 8 ||
          pageNumber === currentPage + 8
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
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 20,
    width: 160,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 8,
 
    color: '#8843E1',
    borderRadius: 5,
  },
  text2: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 8,
    color: '#737373',
    borderRadius: 5,
    backgroundColor: '#f2f2f2',
    padding: 8,
  },
});

const styles = StyleSheet.create({
  container: {
    padding: spacing.medium,
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
    height: 200, // Set a fixed height for all cards, adjust as needed
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:"#ecdbfc",
    padding:7
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
 color:"#8843E1"
  },
  
  button: {
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
  showAllButton: {
    marginTop: spacing.medium,
    alignItems: 'center',
    marginBottom:50, 
    height:45, 
    width:230, 
    alignSelf:"center"
  },
  showAllText: {
    color: colors.white,
    backgroundColor:colors.primary,
    padding:10,
    fontSize: fontSizes.medium,
    fontWeight: 'bold',
  },
});