import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  useColorScheme,
  Dimensions,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';

import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import cities from "../services/data/cities.json"
import axios from 'axios';

import { useTranslation } from 'react-i18next';
import LoadingScreen from '../components/LoadingScreen';
const CompanyList = () => {
  const navigation = useNavigation();
  const isDarkMode = useColorScheme() === 'dark';
  const [companies, setCompanies] = useState([]);
  const [companyVacancies, setCompanyVacancies] = useState({});
  const [sectors, setSectors] = useState([]);
  const [selectedSector, setSelectedSector] = useState('All Sectors');
  const [isLoading, setIsLoading] = useState(true);
  const [vacancies, setVacancies] = useState([]);
  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const response = await axios.get(
          'https://movieappi.onrender.com/vacancies'
        );
        setVacancies(response.data.vacancies);
      } catch (error) {
        console.error(error);
      }
    };

    fetchVacancies();
  }, []);
  const handleSectorChange = (sector: React.SetStateAction<string>) => {
    setSelectedSector(sector);
  };
  
  useEffect(() => {
    axios
      .get(`https://movieappi.onrender.com/sectors`)
      .then(response => {
        setSectors(response.data);
      })
      .catch(error => {
        console.error('API call failed:', error);
      });
  }, []);
  
  const handlePress = (companyId) => {
    navigation.navigate('aboutCompanyMain', { companyId });
    console.log('slam1', companyId);
  };


 useEffect(() => {
    axios
      .get(`https://movieappi.onrender.com/companies`)
      .then(response => {
        setCompanies(response.data);
        setIsLoading(false); // Data fetched, set isLoading to false
      })
      .catch(error => {
        console.error('API call failed:', error);
        setIsLoading(false); // Error occurred, set isLoading to false
      });
  }, []);
  const [sortedCompanies, setSortedCompanies] = useState(companies);
  const [sortOption, setSortOption] = useState('A-Z');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [selectedCity, setSelectedCity] = useState(null);

  const handleCityChange = (city: React.SetStateAction<null>) => {
    setSelectedCity(city);
  };

  const filteredVacancies = vacancies.filter((vacancy: { city_id: null; }) => {
    return vacancy.city_id === selectedCity;
  });
  // const totalItems = companies.length;
  // const totalPages = Math.ceil(totalItems / itemsPerPage);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const sortCompanies = option => {
    setSortOption(option);

    switch (option) {
      case 'A-Z':
        setCompanies(
          [...companies].sort((a, b) => a.name.localeCompare(b.name)),
        );
        break;
      case 'Z-A':
        setCompanies(
          [...companies].sort((a, b) => b.name.localeCompare(a.name)),
        );
        break;
      case 'Vacancy Count (Ascending)':
        setCompanies(
          [...companies].sort(
            (a, b) => a.vacanc_say - b.vacanc_say,
          ),
        );
        break;
      case 'Vacancy Count (Descending)':
        setCompanies(
          [...companies].sort(
            (a, b) => b.vacanc_say - a.vacanc_say,
          ),
        );
        break;
      default:
        break;
    }

    setCurrentPage(1);
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
  const {t} = useTranslation();
  const handlePage = (pageNumber: any) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const filteredCompanies =
    selectedSector === 'All Sectors'
      ? companies
      : companies.filter((company) => company.sector_id === selectedSector);

  const totalItems = filteredCompanies.length; // Use filteredCompanies length instead of companies length
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Update the visibleCompanies based on the currentPage and filteredCompanies
  const visibleCompanies = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return <LoadingScreen />;
  } else {
  return (
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#131313' : '#F4F9FD'}]}>
<View style={{flexDirection:"row",}}>

<View style={styles.pickerContainer}>
<Picker
    selectedValue={sortOption}
    onValueChange={(option) => sortCompanies(option)}
    style={[styles.pickerStyle, { width: '100%', color: isDarkMode ? 'white' : 'black' }]}
  >
    <Picker.Item label={t('a-z')} value="A-Z" style={{ color: isDarkMode ? 'white' : 'black' }} />
    <Picker.Item label={t('z-a')} value="Z-A" style={{ color: isDarkMode ? 'white' : 'black' }} />
    <Picker.Item
      label={t('vacancy_asc')}
      value="Vacancy Count (Ascending)"
      style={{ color: isDarkMode ? 'white' : 'black' }}
    />
    <Picker.Item
      label={t('vacancy_desc')}
      value="Vacancy Count (Descending)"
      style={{ color: isDarkMode ? 'white' : 'black' }}
    />
  </Picker>
</View>
  {/* Another Picker */}

  <View style={styles.pickerContainer}>
  <Picker
    selectedValue={selectedSector}
    onValueChange={handleSectorChange}
    style={[styles.pickerStyle, { width: '100%', color: isDarkMode ? 'white' : 'black' }]}
  >
    <Picker.Item label={t('all_sector')} value="All Sectors" style={{ color: isDarkMode ? 'white' : 'black' }} />
    {sectors.map((sector) => (
      <Picker.Item
        key={sector.id}
        label={sector.title_az}
        value={sector.id} // Use the sector's id as the value
        style={{ color: isDarkMode ? 'white' : 'black' }}
      />
    ))}
  </Picker>

</View>
</View>

      {visibleCompanies.map((item, index, arr) => (
     <View style={{ flexDirection: 'row' }}>
 <Pressable onPress={() => handlePress(arr[index * 2]?.id)}>
  {arr[index * 2] && (
    <View
      style={{
        paddingVertical: 16,
        flex: 1,
        justifyContent: 'center',
        width: '40%',
      }}>
      <LinearGradient
        colors={['#B298D3', '#652AB0']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        useAngle
        angle={180}
        style={{
          flexDirection: 'row',
          flex: 1,
          flexWrap: 'nowrap',
          justifyContent: 'space-between',
          marginHorizontal: screenWidth * 0.03, // Adjust the margin based on screen width
          width: screenWidth * 0.4, // Adjust the width based on screen width
          borderRadius: 20,
        }}>
        <View style={[styles.card, { width: screenWidth * 0.4, height: screenHeight * 0.05 }]}>
            <View style={styles.box}>
              <Image
                source={{
                  uri: `https://1is.az/${arr[index * 2]?.image}`,
                }}
                style={{
                  width: 130,
                  height: 90,
                  backgroundColor: '#fff',
                  borderRadius: 5,
                  resizeMode: 'contain',
                }}
              />
            </View>
            <View style={styles.text}>
            <Text
      style={{
        flexShrink: 1,
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
      }}
      numberOfLines={2} // Set maximum number of lines
    >
      {arr[index * 2].name}
    </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                <Image
                  source={require('AwesomeProject/src/assets/images/whitebag.png')}
                  style={{ width: 15, height: 15 }}
                />
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 12,
                    fontWeight: '600',
                    marginRight: 10,
                  }}
                >
                  {arr[index * 2].view}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    )}
  </Pressable>

  <Pressable onPress={() => handlePress(arr[index * 2 + 1]?.id)}>
  {arr[index * 2 + 1] && (
    <View
      style={{
        padding: 16,
        flex: 1,
        justifyContent: 'center',
        width: '50%',
      }}>
      <LinearGradient
        colors={['#B298D3', '#652AB0']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        useAngle
        angle={180}
        style={{
          flexDirection: 'row',
          flex: 1,
          flexWrap: 'nowrap',
          justifyContent: 'space-between',
          marginHorizontal: screenWidth * 0.04, // Adjust the margin based on screen width
          width: screenWidth * 0.4, // Adjust the width based on screen width
          borderRadius: 20,
        }}>
        <View style={[styles.card, { width: screenWidth * 0.4 }]}>
            <View style={styles.box}>
              <Image
                source={{
                  uri: `https://1is.az/${arr[index * 2 + 1]?.image}`,
                }}
                style={{
                  width: 130,
                  height: 90,
                  backgroundColor: '#fff',
                  borderRadius: 5,
                  resizeMode: 'contain',
                }}
              />
            </View>
            <View style={styles.text}>
              <Text
                style={{
                  flexShrink: 1,
                  color: '#FFFFFF',
                  fontSize: 12,
                  fontWeight: '600',
                }}
                numberOfLines={2} // Limit the text to one or two lines
                ellipsizeMode="tail"
              >
                {arr[index * 2 + 1].name}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', }}>
                <Image
                  source={require('AwesomeProject/src/assets/images/whitebag.png')}
                  style={{ width: 15, height: 15, }}
                />
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 12,
                    fontWeight: '600',
                    marginRight: 10,
                  }}
                >
                  {arr[index * 2 + 1].view}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    )}
  </Pressable>
</View>

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

          <Text style={{ color: isDarkMode ? "white" : '#161C2D', fontSize: 14, fontWeight: '600'}}>
            {' '}
            {t('total')} {filteredCompanies.length}
          </Text>
        </View>
      </View>
    </ScrollView>
  );}
};

export default CompanyList;
const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 180,
    height: 150,
    padding: 12,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  container: {
    flex: 1,

  },
  pickerContainer: {
   width:"40%",
    marginVertical: 20,
    marginHorizontal: 20,
    borderWidth: 2,
    borderColor: '#8843E1',
    borderRadius: 12,
    flexDirection:"row",


  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#652AB0',
    marginBottom: 8,
    justifyContent:"center", 
    alignContent:"center", 
    alignItems:"center", 
    alignSelf:"center", 

  },
  pickerStyle: {
    color: 'black',
  },
  box: {
    width: 0.3 * Dimensions.get('window').width, // 30% of the screen width
    aspectRatio: 1, // Maintain a 1:1 aspect ratio (height will adjust automatically)
    borderRadius: 0.02 * Dimensions.get('window').width, // 2% of the screen width
    padding: 0.013 * Dimensions.get('window').width, // 1.3% of the screen width
  },
  text: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -0.02 * Dimensions.get('window').height, // 2% of the screen height
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