import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Pressable,
  useColorScheme,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import {colors} from '../assets/themes';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AuthHeader from '../components/AuthHeader';
import { useTranslation } from 'react-i18next';
import LoadingScreen from '../components/LoadingScreen';

const TelimMainScreen = () => {
  const navigation = useNavigation();
  const isDarkMode = useColorScheme() === 'dark';
   const [isLoading, setIsLoading] = useState(true);
  // const [sortOption, setSortOption] = useState('A-Z');
  const {t} = useTranslation();
const [telims, settelims] = useState([])
useEffect(() => {
  axios
    .get(`https://movieappi.onrender.com/trainings`)
    .then((response) => {
      settelims(response.data);
      setIsLoading(false); // Data fetched, set isLoading to false
    })
    .catch((error) => {
      console.error('API call failed:', error);
      setIsLoading(false); // Error occurred, set isLoading to false
    });
}, []);
const [sortedCompanies, setSortedCompanies] = useState(telims);


  const isDeadlinePassed = (date: string) => {
    const deadline = new Date(date);
    return deadline < new Date();
  };
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const handlePress = (telimId: string) => {
    navigation.navigate('TelimInner', {telimId});
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const totalItems = telims.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
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

  const visibleCompanies = telims.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  console.log(telims.length);
  const truncateTitle = (title) => {
    const maxLength = 30;
    if (title.length > maxLength) {
      return title.slice(0, maxLength) + '...';
    }
    return title;
  };
  if (isLoading) {
    return <LoadingScreen />;
  } else {
  return (
    <ScrollView style={ {backgroundColor: isDarkMode ? '#131313' : '#F4F9FD'}}>
             <AuthHeader title={t('trainings')} textColor={isDarkMode ? 'white' : 'black'} />

      <View style={styles.container}>
   
        {visibleCompanies.map((telim, index) => (
          <View style={[styles.card, {marginLeft: index % 2 === 0 ? 0 : 5, backgroundColor: isDarkMode ? "#0D0D0D" : "#FDFDFD",   width: screenWidth * 0.39,
          height: screenHeight * 0.28,
          marginLeft: screenWidth * 0.02,
          marginBottom: screenHeight * 0.01,}]}>
            {isDeadlinePassed(telim.deadline) ? null : (
              <View style={styles.dot} />
            )}
            <Image
              source={{uri:  `https://1is.az/${telim?.image}`}}
              style={{
                width: 70,
                height: 70,
                borderRadius: 35,
    
                alignSelf: 'center',
                top: 7,
              }}
            />
  <Text style={[styles.text, {color: isDarkMode ? "#FDFDFD" : "#0D0D0D"}]}>
  {truncateTitle(telim.title)}
</Text>

            <Text style={styles.text}>
              {' '}
              {telim.payment_type === '1' ? (
                <Text style={{color: isDarkMode ? "#FDFDFD" : "#0D0D0D"}}>{telim.price} azn</Text>
              ) : (
                <Text style={{color: isDarkMode ? "#BFB2B2" : "#6F6464"}}>{t('free')}</Text>
              )}
            </Text>
            <Pressable
              style={styles.button}
              onPress={() => handlePress(telim.id)}>
              <Text style={styles.buttonText}>{t('incele')}</Text>
            </Pressable>
          </View>
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
            <Text style={{ color: isDarkMode ? '#FDFDFD' : '#020202', fontSize: 14, fontWeight: '600' }}>
              {' '}
              {t('total')} {totalItems}
            </Text>
          </View>
        </View>

    </ScrollView>
  );}
};

export default TelimMainScreen;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 31,
    marginTop: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 170,
    height: 270,
    backgroundColor: colors.white,
    marginBottom: 16,
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
  dot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'green',
    top: 15,
    right: 15,
  },

  text: {
    textAlign: 'center',
    color: colors.black,
    fontSize: 14,
    top: 10,
    flexWrap: 'nowrap',
  },
  textbox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    alignSelf: 'center',
  },
  hover: {
    position: 'absolute',
    borderRightColor: 'rgba(136, 67, 225, 0.8)',
    borderEndWidth: 3,
    left: '76%',
    height: 45,
    bottom: 0,
  },
  blur: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
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
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 10,
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