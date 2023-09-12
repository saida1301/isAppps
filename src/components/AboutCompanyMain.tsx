import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Linking,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CompanySearchScreen from './CompanySearchScreen';
import {borderRadius, colors, fontSizes, spacing} from '../assets/themes';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import axios from 'axios';

import LoadingScreen from './LoadingScreen';
import {t} from 'i18next';
import {useTranslation} from 'react-i18next';
import StarRatingg from './StarRatingg';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import AuthHeader from './AuthHeader';
import ComponentStar from './ComponentStar';
import i18n from '../i18n';

import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../store/redux/favoriteSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLikedVacancy } from '../LikedVacanciesContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const AboutCompanyMain = ({route}: any) => {
  const {companyId, vacancyId} = route.params;
  console.log(companyId);
  const [data, setData] = useState([]);
  const [vacancies, setVacancies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const initialReviewsToShow = 4; // Number of reviews to show initially
  const reviewsPerLoad = 4; // Number of reviews to load each time the "Load More" button is clicked
  const [reviewsToShow, setReviewsToShow] = useState(initialReviewsToShow);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const [isFavorite, setIsFavorite] = useState([]);
  const dispatch = useDispatch();
  const [userId, setUserId] = useState(null);
  const email = useSelector(state => state.auth.email);
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

 
  const handleLoadMoreReviews = () => {
    // Increase the number of reviews to show by the reviewsPerLoad value
    setReviewsToShow(reviewsToShow + reviewsPerLoad);
  };
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`https://movieappi.onrender.com/companies/${companyId}`)
      .then(response => {
        console.log(response.data);
        setData(response.data);
      })
      .catch(error => {
        console.error('API call failed:', error);
      });
  }, [companyId]);
  const [currentPage, setCurrentPage] = useState(1);
// Change the API endpoint for fetching vacancies
useEffect(() => {
  axios
    .get(`https://movieappi.onrender.com/vacancies/company/${companyId}?page=${currentPage}`)
    .then((response) => {
      setVacancies(response.data);
      // Assuming the server sends totalPages as part of the response
      const totalPages = response.data.totalPages;
      // Check if there are more vacancies beyond the current page and set the state accordingly

    })
    .catch((error) => {
      console.error('API call failed:', error);
    });
}, [companyId, currentPage]);


  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`https://movieappi.onrender.com/categories`)
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('API call failed:', error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`https://movieappi.onrender.com/companies`)
      .then(response => {
        setCompanies(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('API call failed:', error);
      });
  }, []);

  const salam = data[0]?.about;
  const {t} = useTranslation();
  const website = data[0]?.website?.replace(/\\/g, '').replace(/"/g, '');
  const [reviews, setReviews] = useState([]);
  const instagram = data[0]?.instagram?.replace(/\\/g, '').replace(/"/g, '');
  const linkedin = data[0]?.linkedin?.replace(/\\/g, '').replace(/"/g, '');
  const facebook = data[0]?.facebook?.replace(/\\/g, '').replace(/"/g, '');
  const salamm = vacancies.filter(
    (vacancy: {company_id: any}) => vacancy.company_id === data[0]?.id,
  );

  const isDarkMode = useColorScheme() === 'dark';
  const [numToShow, setNumToShow] = useState(8 - 4);
  const handleLoadMore = () => {
    setNumToShow(numToShow + 4);
  };

  const handlePresss = (vacancyId: string) => {
    navigation.navigate('VacancyInner', {vacancyId});
  };
  useEffect(() => {
    axios
      .get(`https://movieappi.onrender.com/reviews/${companyId}`)
      .then(response => {
        setReviews(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
      });
  }, [companyId]);
  const navigation = useNavigation();
  const paddingHorizontal = screenWidth < 400 ? 10 : 20; // Adjust as needed
const marginVertical = screenHeight < 600 ? 10 : 20; // Adjust as needed
const paddingVertical = screenHeight < 600 ? 10 : 20; // Adjust as needed
  function handlePress(companyId: any) {
    navigation.push('aboutCompany', {companyId});
    console.log('salam2');
  }
  if (isLoading) {
    return <LoadingScreen />;
  } else {
    return (
      <ScrollView
        style={{
          backgroundColor: isDarkMode ? '#131313' : '#F4F9FD',
        }}>
        <AuthHeader
          title={t('about_company')}
          textColor={isDarkMode ? 'white' : 'black'}
        />
<View
  style={[
    styles.box,
    {
      flexDirection: 'row',
      marginVertical: screenHeight * 0.01,
      marginHorizontal: screenWidth * 0.03,
    },
  ]}
>
  <View
    style={[
      styles.card2,
      {
        width: screenWidth * 0.5,
        height: screenHeight * 0.190,
        marginLeft: screenWidth * 0.02,
        marginBottom: screenHeight * 0.01,
      },
    ]}
  >
            <Image
              source={{
                uri: `https://1is.az/${data[0]?.image}`,
              }}
              style={{
                aspectRatio: 1,
                width: 150,
                borderRadius: 8,
                resizeMode: 'contain',
              }}
            />
          </View>
          <View
    style={{
      backgroundColor: isDarkMode ? '#0D0D0D' : '#FDFDFD',
      // Add shadow styles based on the isDarkMode value
      shadowColor: isDarkMode ? '#FFF' : '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.8 : 0.3,
      shadowRadius: isDarkMode ? 4 : 2,
      elevation: isDarkMode ? 5 : 2,

      // Elevation is for Android shadow
      width: screenWidth * 0.48,
      height: screenHeight * 0.172,
      marginLeft: screenWidth * 0.02,
      marginBottom: screenHeight * 0.03,

      borderRadius: 8,
      paddingVertical: 6,
    }}
  >
     <Text
  style={[
    styles.about,
    {color: isDarkMode ? '#FDFDFD' : '#0D0D0D'},
  ]}
>
  {salam?.length > 50 ? salam?.substring(0, 50) + '...' : salam}
</Text>

            <View style={{alignSelf: 'center', padding: 8, marginTop: 20}}>
              <Pressable
                style={styles.button}
                onPress={() => handlePress(data[0]?.id)}>
                <Text style={{color: 'white'}}> {t('etrafli')}</Text>
              </Pressable>
            </View>
            <View
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
                alignContent: 'center',
             
              }}>
              <ComponentStar company_id={companyId} />
            </View>
          </View>
        </View>

        <View
  style={[
    styles.link,
    {
      backgroundColor: isDarkMode ? '#0D0D0D' : '#FDFDFD',
      // Add shadow styles based on the isDarkMode value
      shadowColor: isDarkMode ? '#FFF' : '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.8 : 0.3,
      shadowRadius: isDarkMode ? 4 : 2,
      elevation: isDarkMode ? 5 : 2,
      width: screenWidth * 0.88,
      height: screenHeight * 0.15,
      marginLeft: screenWidth * 0.05,
      marginBottom: screenHeight * 0.01,

      // Elevation is for Android shadow
    },
  ]}
>
          <Text
            style={{
              color: isDarkMode ? '#FDFDFD' : '#000',
              alignSelf: 'center',
              marginTop: -10,
              fontSize: 14,
              fontWeight: 600,
            }}>
            {t('website')}{' '}
          </Text>

          <View
  style={{
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
    width: '100%',
    marginTop: 20,
  }}>
  {website && (
    <Pressable
      style={styles.iconButton}
      onPress={() => {
        Linking.openURL(website);
      }}>
      <FontAwesomeIcon name="globe" size={20} color="white" />
    </Pressable>
  )}

  {facebook && (
    <Pressable
      style={styles.iconButton}
      onPress={() => {
        Linking.openURL(facebook);
      }}>
      <FontAwesomeIcon name="facebook" size={20} color="white" />
    </Pressable>
  )}

  {instagram && (
    <Pressable
      style={styles.iconButton}
      onPress={() => {
        Linking.openURL(instagram);
      }}>
      <FontAwesomeIcon name="instagram" size={20} color="white" />
    </Pressable>
  )}

  {linkedin && (
    <Pressable
      style={styles.iconButton}
      onPress={() => {
        Linking.openURL(linkedin);
      }}>
      <FontAwesomeIcon name="linkedin" size={20} color="white" />
    </Pressable>
  )}
</View>

        </View>
        <View style={styles.containerr}>
  <View
    style={[
      styles.cards,
      {
        backgroundColor: isDarkMode ? '#0D0D0D' : '#FDFDFD',
        // Add shadow styles based on the isDarkMode value
        shadowColor: isDarkMode ? '#FFF' : '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDarkMode ? 0.8 : 0.3,
        shadowRadius: isDarkMode ? 4 : 2,
        elevation: isDarkMode ? 5 : 2,
        width: screenWidth * 0.5,
        height: screenHeight * 0.115,

        marginBottom: screenHeight * 0.01,
        // Elevation is for Android shadow
      },
    ]}
  >
            <Text
              style={{
                color: isDarkMode ? '#FDFDFD' : '#020202',
                alignSelf: 'flex-start',
                paddingLeft: 10,
                fontSize: 14,
                fontWeight: 600,
              }}>
              {t('view')}
            </Text>
            <Text
              style={{
                color: isDarkMode ? '#FDFDFD' : '#020202',
                alignSelf: 'flex-start',
                paddingLeft: 10,
                paddingTop: 30,
                fontSize: 14,
              }}>
              {data[0]?.view}{' '}
              <FontAwesomeIcon name="user" size={20} color={colors.primary} />{' '}
              {/* Use "user" icon instead of "account" */}
            </Text>
          </View>

          <View
    style={[
      styles.cardss,
      {
        backgroundColor: isDarkMode ? '#0D0D0D' : '#FDFDFD',
        // Add shadow styles based on the isDarkMode value
        shadowColor: isDarkMode ? '#FFF' : '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDarkMode ? 0.8 : 0.3,
        shadowRadius: isDarkMode ? 4 : 2,
        elevation: isDarkMode ? 5 : 2,
        width: screenWidth * 0.5,
        height: screenHeight * 0.115,
        marginLeft: screenWidth * 0.02,
        marginBottom: screenHeight * 0.01,

        // Elevation is for Android shadow
      },
    ]}
  >
            <Text
              style={{
                color: isDarkMode ? '#FDFDFD' : '#020202',
                alignSelf: 'flex-end',
                paddingRight: 10,
                fontSize: 15,
                fontWeight: 600,
              }}>
              {t('ofis')}
            </Text>
            <Text
              style={{
                color: isDarkMode ? '#FDFDFD' : '#020202',
                alignSelf: 'flex-end',
                paddingLeft: 10,
                fontSize: 13,
                paddingTop: 10,
              }}>
              {data[0]?.address}
            </Text>
          </View>
        </View>
        <View>
          <View>
            {salamm.length > 0 ? (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}>
                  <View style={{paddingTop: 12}}>
                    <Text
                      style={{
                        color: isDarkMode ? '#FDFDFD' : '#020202',
                        fontSize: 15,
                        fontWeight: '600',
                        right: screenWidth * 0.07,
                      }}>
                      {t('vacancies')}
                    </Text>
                    <Text
                      style={{
                        color: '#A6A6A6',
                        fontSize: 12,
                        right: screenWidth * 0.07,
                      }}>
                      {t('total_result')} : {salamm.length}
                    </Text>
                  </View>
                  <View style={{justifyContent: 'flex-end', alignSelf:"flex-end"}}>
                    <Pressable style={styles.button2} onPress={handleLoadMore}>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: '#C7C7C7',
                          alignSelf: 'center',
                        }}>
                        {t('more')}
                      </Text>
                    </Pressable>
                  </View>
                </View>
                <View>
                  <View
                    style={[
                      styles.containerrr,
                    ]}>
                    {salamm.slice(0, numToShow).map((vacancy: any) => (
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
                               <Text style={[styles.button3,{ color: isFavorite?.includes(vacancy.id) ? 'red' : '#C7C7C7' }]}>
            {likedVacanciesData?.some(v => v.id === vacancy.id) ? (
                                      <Icon name="heart" size={25}  color={"red"} style={styles.button3}/>
                                    ) : (
                                      <Icon name="heart-outline" size={25} style={styles.button3} />
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
                </View>
              </>
            ) : (
              <Text style={{textAlign: 'center'}}>{t('no_vacancy')}</Text>
            )}
          </View>
          <View style={{marginBottom:100}}>
      <Text style={[styles.headerText, {color: isDarkMode ? '#FDFDFD' : '#020202',}]}>{t('reviews')}</Text>
      {reviews.length > 0 ? (
        <View>
          {reviews.slice(0, reviewsToShow).map((review) => (
            <View key={review.id} style={[styles.reviewBox, {             backgroundColor: isDarkMode ? 'black' : 'white',
            shadowColor: isDarkMode ? '#FFF' : '#000',
                           shadowOffset: { width: 0, height: 2 },
                           shadowOpacity: isDarkMode ? 0.8 : 0.3,
                           shadowRadius: isDarkMode ? 4 : 2,
                           elevation: isDarkMode ? 5 : 2,
                           width: screenWidth * 0.87,
                height: screenHeight * 0.15,
                marginLeft: Dimensions.get('window').width * 0.07,
                marginBottom: screenHeight * 0.02,
          }]}>
              <View style={styles.reviewHeader}>
                <Image
                  source={{
                    uri: `https://1is.az/${review?.image}`,
                  }}
                  style={styles.profileImage}
                />
                <View style={styles.reviewInfo}>
                  <Text style={[styles.fullname, {color: isDarkMode ? '#FDFDFD' : '#020202',} ]}>{review.fullname}</Text>
                  <View style={styles.ratingContainer}>
  <Text style={[styles.rating, { color: isDarkMode ? '#FDFDFD' : '#020202' }]}>
    {review?.rating}
  </Text>
  <View style={styles.starIconsContainer}>
    {Array.from({ length: review?.rating }, (_, index) => (
      <Image
        key={index}
        source={require('AwesomeProject/src/assets/images/filled-star.webp')}
        style={styles.starIcon}
      />
    ))}
  </View>
</View>

                </View>
                <Text style={[styles.createdAt,  {color: isDarkMode ? '#FDFDFD' : '#020202',}]}>
                  {moment(review.created_at).format('DD.MM.YYYY')}
                </Text>
              </View>
              <Text style={[styles.reviewMessage,  {color: isDarkMode ? '#FDFDFD' : '#020202',}]}>{review.message}</Text>
            </View>
          ))}
          {reviewsToShow < reviews.length && (
            <TouchableOpacity
              style={styles.loadMoreButton}
              onPress={handleLoadMoreReviews}>
              <Text style={styles.loadMoreButtonText}>{t('more')}</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <Text style={[styles.noReviewText,  {color: isDarkMode ? '#FDFDFD' : '#020202',}]}>{t('no_review')}</Text>
      )}
    </View>
        </View>
      </ScrollView>
    );
  }
};

export default AboutCompanyMain;

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
  },

  container: {},
  card2: {
    width: '100%',
    maxWidth: 150,
    height: 150,
    marginLeft: 20,
    marginBottom: 20,
  },
  // categoryContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: '#ecdbfc',
  //   padding: 7,
  // },
  iconButton: {
    backgroundColor: '#9559E5',
    padding: 10,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {

    fontSize: 15,
    fontWeight: '600',
    marginLeft: 20,
    marginBottom: 10,
 
  },
  reviewBox: {

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.11,
    marginLeft: Dimensions.get('window').width * 0.04,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 8,
    padding: 12,
    
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    resizeMode: 'cover',
  },
  reviewInfo: {
    flex: 1,
    marginLeft: 12,
  },
  fullname: {
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginRight: 5,
    fontWeight: 'bold',
  },
  starIconsContainer: {
    flexDirection: 'row', // Horizontally align the star icons
  },
  starIcon: {
    width: 12,
    height: 12,
    marginRight: 2,
  },
  createdAt: {
    fontSize: 12,
  },
  reviewMessage: {
    marginTop: 8,
  },
  loadMoreButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  loadMoreButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  noReviewText: {
    textAlign: 'center',
    marginTop: 50,
  },
  // card: {
  //   borderRadius: borderRadius.medium,
  //   padding: spacing.medium,
  //   marginBottom: spacing.medium,
  //   shadowColor: colors.black,
  //   shadowOffset: {
  //     width: 0,
  //     height: 2,
  //   },
  //   shadowOpacity: 0.05,
  //   shadowRadius: 4,
  //   elevation: 2,
  //   height: 100, // Set a fixed height for all cards, adjust as needed
  // },
  about: {
    fontSize: 14,
    color: 'black',
    marginLeft: 4,
  },

  button: {
    marginLeft: 'auto',
    padding:  Dimensions.get('window').width * 0.02,
    borderRadius:  Dimensions.get('window').width * 0.01,
    backgroundColor: colors.primary,
  },
  
  button3: {
    marginLeft: 'auto',
    padding:  Dimensions.get('window').width * 0.02,
    borderRadius:  Dimensions.get('window').width * 0.01,

  },
  icon: {
    color: colors.white,
    backgroundColor: '#8843E1',
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  icon2: {
    marginRight: '90%',
    marginTop: 20,
    position: 'absolute',
    alignSelf: 'center',
    right: 10,
    top: '50%',
    transform: [{translateY: -12}],
  },
  link: {
    borderRadius: 5,
    width: '100%',
    maxWidth: 360,
    height: 100,
    marginHorizontal: 20,
    columnGap: 8,
    paddingVertical: 20,
  },

  containerr: {
    flexDirection: 'row',
    marginHorizontal: 20,
    rowGap: 30,
    marginVertical: 10,
  },

  addToFavoritesIcon: {
    position: 'absolute',
    left: 15,
    right: 10,
    top: 0,
    alignItems: 'center',
    alignSelf: 'center',
    marginRight: 22,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  cards: {
    width: '100%',
    maxWidth: 130,
    height: 100,
    borderRadius: 8,
    marginRight: 20,

    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 10,
  },
  cardss: {
    width: '100%',
    maxWidth: 210,
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,

    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 10,
  },
  button2: {
    width: 105,
    maxWidth:"100%",
    
    height: 28,
    borderRadius: 63,
    borderWidth: 1,
    borderColor: '#C7C7C7',
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

  cardw: {
    width: '100%',
    maxWidth: 350,
    height: 135,
    backgroundColor: colors.white,
    borderRadius: borderRadius.small,
    marginBottom: spacing.medium,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.medium,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  containerrr: {
    flex: 1,
    borderRadius: borderRadius.medium,
    marginHorizontal: spacing.medium,
    marginVertical: spacing.small,
    padding: spacing.small,
  },
  boxi: {
    width: 350,
    height: 100,
    backgroundColor: 'white',
    flex: 1,
    borderRadius: borderRadius.medium,
    marginHorizontal: spacing.medium,
    marginVertical: spacing.small,
    padding: spacing.small,
    alignSelf: 'center',
  },
});