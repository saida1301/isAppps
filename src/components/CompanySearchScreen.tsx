import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Pressable, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

import SearchInput from './Input/SearchInput';
import { useTranslation } from 'react-i18next';
import { useSearchHistory } from '../SearchHistoryContext';

const CompanySearchScreen = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [vacancies, setVacancies] = useState([]);
  const [searchHistorys, setSearchHistory] = useState([]);
  const navigation = useNavigation();
  const isDarkMode = useColorScheme() === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
const [trainings, settrainings] = useState([])
const [blogs, setblogs] = useState([])
  const {t} = useTranslation();
  
  useEffect(() => {
    fetchData();
    loadSearchHistory();
  }, []);
  const fetchData = async () => {
    try {
      const page = 1; // Set the page number you want to fetch
      const pageSize = 6000; // Set the desired page size
  
      const [companiesResponse, vacanciesResponse, trainingsResponse, blogsResponse] = await Promise.all([
        axios.get(`https://movieappi.onrender.com/companies?page=${page}&pageSize=${pageSize}`),
        axios.get(`https://movieappi.onrender.com/vacancies?page=${page}&pageSize=${pageSize}`),
        axios.get('https://movieappi.onrender.com/trainings'),
        axios.get('https://movieappi.onrender.com/blogs'),
      ]);
  
      setCompanies(companiesResponse.data);
      setVacancies(vacanciesResponse.data);
      settrainings(trainingsResponse.data);
      setblogs(blogsResponse.data)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const loadSearchHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem('searchHistory');
      if (storedHistory) {
        setSearchHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  const saveSearchHistory = async () => {
    try {
      await AsyncStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  const handleSearch = (query) => {
    if (query) {
      const filteredCompanies = companies.filter((company) =>
        company.name.toLowerCase().includes(query.toLowerCase())
      );
      const filteredVacancies = vacancies.filter((vacancy) =>
        vacancy.position.toLowerCase().includes(query.toLowerCase())
      );
      const filteredTrainings = trainings.filter((training) =>
        training.title.toLowerCase().includes(query.toLowerCase())
      );
      const filteredBlogs = blogs.filter((blog) =>
        blog.slug.toLowerCase().includes(query.toLowerCase())
      );
      const filteredData = [
        ...filteredCompanies,
        ...filteredVacancies,
        ...filteredTrainings,
        ...filteredBlogs,
      ];
      setFilteredData(filteredData);
  
      // Clear the search query after performing a search
      setSearchQuery('');
      // Check if the query is already in history before adding it
      if (!searchHistorys.includes(query)) {
        addToSearchHistory(query);
      }
    } else {
      setFilteredData([]);
    }
  
    // Clear the search query after performing a search
    setSearchQuery('');
  };
  
  
  const { searchHistory, addToHistory, deleteFromHistory } = useSearchHistory(); // Use the search history context
  
  const addToSearchHistory = (query) => {
    setSearchHistory((prevHistory) => {
      if (!prevHistory.includes(query)) {
        return [query, ...prevHistory];
      }
      return prevHistory;
    });
    saveSearchHistory();
  };

  const deleteFromSearchHistory = (query) => {
    setSearchHistory((prevHistory) => prevHistory.filter((item) => item !== query));
    saveSearchHistory();
  };

  const navigateToDetails = (item) => {
    const { id, position, name , title,  slug} = item;
    if (position) {
      navigation.navigate('VacancyInner', { vacancyId: id });
    } else if (name) {
      navigation.navigate('aboutCompanyMain', { companyId: id });
    }  else if (title) {
      navigation.navigate('TelimInner', { telimId: id });
    }
    else if (slug) {
      navigation.navigate('blogInner', { blogId: id });
    }

    addToHistory(name || position);
  };

  const handleInputPress = () => {
    navigation.navigate('swipe');
  };

  const renderSearchHistoryItem = (query) => (
    <Pressable
      key={query}
      onPress={() => handleSearch(query)}
      style={styles.searchHistoryItem}
    >
      <Text style={styles.searchHistoryText}>{query}</Text>
      <Icon
        name="close-circle"
        size={20}
        color="#999"
        onPress={() => {
          handleSearch(query); // Trigger the search when a history item is clicked
          deleteFromHistory(query); // Delete the item from history
        }}
      />
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? 'black' : 'white' }]}>
      <SearchInput onSearch={handleSearch} onPress={handleInputPress} clearTextOnFocus={filteredData.length > 0} />

      {filteredData.length > 0 && (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable onPress={() => navigateToDetails(item)} style={styles.itemContainer}>
              <View>
                {item.position && (
                  <Text style={[styles.text, { color: isDarkMode ? 'white' : 'black' }]}>{item.position}</Text>
                )}
                {item.name && (
                  <Text style={[styles.text, { color: isDarkMode ? 'white' : 'black' }]}>{item.name}</Text>
                )}
              </View>
              <Icon name="remove" size={24} color="#999" />
            </Pressable>
          )}
        />
      )}

      <View style={styles.searchHistoryContainer}>{searchHistory.map(renderSearchHistoryItem)}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    marginLeft: 16,
  },
  searchHistoryContainer: {
    paddingVertical: 12,
  },
  searchHistoryTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    marginLeft: 16,
  },
  searchHistoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  searchHistoryText: {
    fontSize: 16,
  },
  deleteIcon: {
    fontSize: 16,
    color: '#999',
  },
  removeIcon: {
    fontSize: 16,
    color: '#999',
  },
});

export default CompanySearchScreen;