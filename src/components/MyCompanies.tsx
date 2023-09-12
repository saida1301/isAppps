import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, useColorScheme, ScrollView, Modal, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import { borderRadius } from '../assets/themes';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [userId, setUserId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const email = useSelector((state) => state.auth.email);
  const navigation = useNavigation();
  const totalItems = companies.length;

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePress = (companyId: any) => {
    navigation.navigate('aboutCompanyMain', { companyId });
  };



  const isDarkMode = useColorScheme() === 'dark';
  const route = useRoute();
  const  companyId  = route.params;
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
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://movieappi.onrender.com/company/${userId}`);
        setCompanies(response.data);
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userId]);


  const companiesPerRow = 2; // Number of companies to display in each row
  const rows = [];

  for (let i = 0; i < totalItems; i += companiesPerRow) {
    const rowCompanies = companies.slice(i, i + companiesPerRow);
    rows.push(rowCompanies);
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
 {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.rowContainer}>
          {row.map((company, index) => (
            <Pressable key={index} onPress={() => handlePress(company.id)}>
              <LinearGradient
                colors={['#B298D3', '#652AB0']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
                useAngle
                angle={180}
                style={styles.card}>
                <View style={styles.box}>
                  <Image
                    source={{ uri: `https://1is.az/${company?.image}` }}
                    style={styles.image}
                  />
                </View>
                <View style={styles.text}>
                  <Text style={styles.companyName} numberOfLines={1}>
                    {company.name}
                  </Text>
                  <View style={styles.vacancyContainer}>
                    <Image
                      source={require('AwesomeProject/src/assets/images/whitebag.png')}
                      style={styles.bagIcon}
                    />
                    <Text style={styles.vacancyText}>{company.vacanc_say}</Text>
                  </View>
                </View>
              </LinearGradient>
            </Pressable>
          ))}
        </View>
      ))}
      <View style={{ alignSelf: 'center', marginTop: 16, marginBottom:30 }}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          handlePage={handlePage}
        />
      </View>
    </ScrollView>
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
         
                color:  pageNumber === currentPage ? 'white' : 'black',
                borderRadius: 5,
                paddingHorizontal: 7,
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
    paddingHorizontal: 20,
    marginVertical:20,
    paddingBottom: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginRight:40,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
 
  card: {
    width: '67%', // Set the width to 70% for each card
    height: 130,
    padding: 12,

    borderRadius: borderRadius.small,
    marginBottom: 10,

  },
  
  
  box: {
    width: '100%',
    aspectRatio: 16 / 9, // Set the aspect ratio of the box
    borderRadius: 5,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 5,
    resizeMode: 'contain',
  },
  text: {
    marginTop: 8,
    flexDirection:"row", 
    justifyContent:"space-between"
  },
  companyName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop:3
  },
  vacancyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 3,
  },
  bagIcon: {
    width: 15,
    height: 15,
  },
  vacancyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 5,
  },
});

export default MyCompanies;