import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, useColorScheme, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import { borderRadius, colors, fontSizes, spacing } from '../assets/themes';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useLikedVacancy } from '../LikedVacanciesContext';

const MyVacancies = () => {
  const [companies, setCompanies] = useState([]);
  const [userId, setUserId] = useState('');
  const email = useSelector((state) => state.auth.email);
  const navigation = useNavigation();
  const [vacancies, setvacancies] = useState([])
  const [categories, setcategories] = useState([])
  function handlePress(vacancyId: any) {
    navigation.navigate('VacancyInnerr', {vacancyId});
    console.log('slam1');
  }
  const isDarkMode = useColorScheme() === 'dark';
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
    axios
      .get(`https://movieappi.onrender.com/vacancies`)
      .then(response => {
        setvacancies(response.data);
      })
      .catch(error => {
        console.error('API call failed:', error);
      });
  }, []);
  useEffect(() => {
    axios
      .get(`https://movieappi.onrender.com/categories`)
      .then(response => {
        setcategories(response.data);
      })
      .catch(error => {
        console.error('API call failed:', error);
      });
  }, []);
  const cardWidth = 160;
  const spacing = 8;
  const containerWidth = cardWidth + spacing * 2;
  const [isFavorite, setIsFavorite] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://movieappi.onrender.com/vacancy/${userId}`);
        setCompanies(response.data);
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userId]);
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
  return (
    <View style={styles.container}>
           {companies.map((company, index) => (
             <View style={{width:"50%", flexDirection:"row"}}>
                    <Pressable key={company.id} onPress={() => handlePress(company.id)}>
                <View
                  style={[
                    styles.card,
                    {
                      backgroundColor: isDarkMode ? '#0D0D0D' : '#FDFDFD',
                      shadowColor: isDarkMode ? '#FFF' : '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: isDarkMode ? 0.8 : 0.3,
                      shadowRadius: isDarkMode ? 4 : 2,
                      elevation: isDarkMode ? 5 : 2,
                    },
                  ]}
                >
                  <View style={styles.vacancyBox}>
                    <View style={styles.vacancyDetails}>
                      <View style={styles.categoryContainer}>
                        <View style={[styles.dot, { backgroundColor: '#8843E1' }]} />
                        <Text style={styles.category}>
                          {categories.find(category => category.id === company.category_id)?.title_az}
                        </Text>
                      </View>
                      <View style={[styles.dot, { backgroundColor: company.status === 0 ? '#FFD700' : '#00FF00' }]} />
      
                    </View>

                    <View>
                      <Text style={[styles.title, { color: isDarkMode ? '#FDFDFD' : '#020202' }]}>{company.position}</Text>

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
  {companies.find(company => company.id === company.company_id)?.name || 'Unknown Company'}
</Text>

                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Image source={require('AwesomeProject/src/assets/images/timee.png')} style={{ width: 15, height: 15 }} />
                          <Text style={[styles.createdDate, { color: isDarkMode ? '#FDFDFD' : '#0D0D0D', marginLeft: 4 }]}>
                            {moment(company.deadline).format('DD.MM.YYYY')}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </Pressable>
             </View>
                    ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.medium,
    alignSelf:"center",   
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
marginBottom:10,
marginTop:-10,
    marginHorizontal: 30,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#8843E1', // Customize the checkbox border color
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#8843E1', // Customize the checked checkbox background color
  },
  pickerContainer: {
   
    paddingHorizontal: 2,
    marginVertical: 30,
    marginHorizontal: 30,
    borderWidth: 2,
    borderColor: '#8843E1',
    borderRadius: 12,
  },
  pickerStyle: {
    color: 'black',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: 'white', // Customize the checked checkbox inner color
  },
  checkboxLabel: {
    color: 'black', // Customize the checkbox label text color
    marginLeft: 8,
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
    marginBottom: 50,
    height: 45,
    width: 230,
    alignSelf: 'center',
  },
  showAllText: {
    color: colors.white,
    backgroundColor: colors.primary,
    padding: 10,
    fontSize: fontSizes.medium,
    fontWeight: 'bold',
  },
}); 

export default MyVacancies;