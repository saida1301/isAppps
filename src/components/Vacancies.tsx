import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  borderRadius,
  colors,
  fontSizes,
  spacing,
} from '../assets/themes/index';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { t } from 'i18next';
import { useLikedVacancies, useLikedVacancy } from '../LikedVacanciesContext';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const Vacancies = ({ vacancyId }: any) => {
  const navigation = useNavigation();
  const [vacancies, setVacancies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [showAllVacancies, setShowAllVacancies] = useState(false);
  const visibleVacancies = showAllVacancies ? vacancies : vacancies.slice(0, 4);
  const [isFavorite, setIsFavorite] = useState([]);
  const isDarkMode = useColorScheme() === 'dark';
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const email = useSelector((state) => state.auth.email);


  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const response = await axios.get('https://movieappi.onrender.com/vacancies', {
          params: {
            page: currentPage,
            pageSize: 4,
          },
        });
  console.log(response.data)      
        const data = response.data;
        setVacancies(data);
      } catch (error) {
        console.log('Error fetching vacancies:', error.message);
      }
    };
    fetchVacancies()
  }, []);
  const heartImageSource = isFavorite.includes(vacancyId)
  ? require('AwesomeProject/src/assets/images/heartfil.png')
  : require('AwesomeProject/src/assets/images/heart3.png');
  useEffect(() => {
    axios
      .get(`https://movieappi.onrender.com/categories`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('API call failed:', error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`https://movieappi.onrender.com/companies`)
      .then((response) => {
        setCompanies(response.data);
      })
      .catch((error) => {
        console.error('API call failed:', error);
      });
  }, []);




  const handlePress = (vacancyId: string) => {
    navigation.navigate('VacancyInner', { vacancyId });
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
  const addToFavoritesOnServer = async (userId, vacancyId) => {
    try {
      await axios.post('https://movieappi.onrender.com/fav', {
        user_id: userId,
        vacancy_id: vacancyId,
      });
      console.log('Vacancy added to favorites on the server:', vacancyId);
    } catch (error) {
      console.log('Error adding vacancy to favorites on the server:', error.message);
    }
  };


  const [isLoading, setIsLoading] = useState(true);
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


  const vacanciesWithCompanyNames = vacancies
    .slice(0, 4)
    .map((vacancy: { company_id: string; position: any }) => {
      const company = companies.find((c) => c.id === vacancy.company_id);
      return {
        ...vacancy,
        company_name: company ? company.name : 'Unknown Company',
        position: `${vacancy.position}`,
      };
    });
    // const { likedVacancies, likeVacancy, removeLikedVacancy } = useLikedVacancies();
  return (
    <ScrollView showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        {visibleVacancies.map(
          (
            vacancy: {
              id(id: any): void;
              category_id: string;
              position:
                | string
                | number
                | boolean
                | React.ReactElement<
                    any,
                    string | React.JSXElementConstructor<any>
                  >
                | React.ReactFragment
                | React.ReactPortal
                | null
                | undefined;
              company_name:
                | string
                | number
                | boolean
                | React.ReactElement<
                    any,
                    string | React.JSXElementConstructor<any>
                  >
                | React.ReactFragment
                | React.ReactPortal
                | null
                | undefined;
              created_at: moment.MomentInput;
            },
            index: React.Key | null | undefined
          ) => (
            <Pressable onPress={() => handlePress(vacancy.id)} key={index}>
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: isDarkMode ? '#0D0D0D' : '#FDFDFD',
                    // Add shadow styles based on the isDarkMode value
                    shadowColor: isDarkMode ? '#FFF' : '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isDarkMode ? 0.5 : 0.2, // Adjust these values
                    shadowRadius: isDarkMode ? 3 : 1, // Adjust these values
                    elevation: isDarkMode ? 3 : 1, // Adjust these values
                     // Elevation is for Android shadow
                  },
                ]}
              >
                <View style={styles.vacancyBox}>
                <View style={styles.vacancyDetails}>
  <View style={styles.categoryContainer}>
    <View style={[styles.dot, { backgroundColor: '#8843E1' }]} />
    <Text style={styles.category}>
      {categories.find(
        (category) => category.id === vacancy.category_id
      )?.title_az}
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
                    {/* <Text
                      style={[
                        styles.title,
                        { color: isDarkMode ? '#FDFDFD' : '#020202' },
                        { maxWidth: '100%' },
                      ]}
                    >
                      {vacancy.position}
                    </Text> */}
                    <Text style={[styles.title, { color: isDarkMode ? '#FDFDFD' : '#020202' }]} numberOfLines={2} ellipsizeMode="tail">{vacancy.position}</Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                    >
                      <View style={{flexDirection:"row", }}>
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
                      <View style={{flexDirection:"row",alignItems:"center" }}>
                      <Image
    source={require('AwesomeProject/src/assets/images/timee.png')}
    style={{ width: 15, height: 15 }}
  />
                        <Text
                          style={[
                            styles.createdDate,
                            { color: isDarkMode ? '#FDFDFD' : '#C7C7C7',  },
                          ]}
                        >
                          {moment(vacancy.created_at).format('DD.MM.YYYY')}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </Pressable>
          )
        )}
        {!showAllVacancies && (
          <TouchableOpacity
            style={styles.showAllButton}
            onPress={() => navigation.navigate('AllVacancies')}
          >
            <Text style={styles.showAllText}>{t('total_vacancy')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

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
    height: 160, // Set a fixed height for all cards, adjust as needed
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
    marginBottom:70, 
    height:45, 
    width:370,

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

export default Vacancies;