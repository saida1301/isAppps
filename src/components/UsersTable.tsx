import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Linking, TextInput, useColorScheme } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { useSelector } from 'react-redux';
import { colors } from '../assets/themes';

const UsersTable = () => {
  const [userData, setUserData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [page, setPage] = useState(1); // Current page number
  const email = useSelector((state) => state.auth.email);
  const itemsPerPage = 10; // Number of items to display per page
const isDarkMode = useColorScheme()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://movieappi.onrender.com/candidates');
        setUserData(response.data);
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const tableHeaders = [
    'First Name',
    'Last Name',
    'Phone Number',
    'CV File',
    'Created Date',
  ];

  const openCVFile = (cvUrl) => {
    if (cvUrl && /^https?:\/\//i.test(cvUrl)) {
      Linking.openURL(cvUrl);
    } else {
      console.log('Invalid or missing CV URL');
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page when performing a search
  };

  const handleFilter = (query) => {
    setFilterQuery(query);
    setPage(1); // Reset to first page when applying a filter
  };

  const filteredData = userData.filter((user) => {
    // Perform search and filter logic here
    const fullName = `${user.name} ${user.surname}`.toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    const filterLower = filterQuery.toLowerCase();

    return (
      fullName.includes(searchLower) &&
      (filterLower === '' || user.phone.toLowerCase().includes(filterLower))
    );
  });

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const goToPreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        value={searchQuery}
        onChangeText={handleSearch}
        placeholderTextColor={ isDarkMode ? "white" : "black"}
      />



      <Table borderStyle={styles.tableBorderStyle}>
        <Row
          data={tableHeaders}
          style={[styles.headerRowStyle, {backgroundColor : isDarkMode ? colors.primary : "red"}]}
          textStyle={styles.headerTextStyle}
        />
        {paginatedData.map((user, index) => (
          <Row
            key={index}
            data={[
              user.name,
              user.surname,
              user.phone,
              <TouchableOpacity
                onPress={() => openCVFile(user.cvFile)}
                style={styles.cvLink}
              >
                <Text style={styles.cvLinkText}>Open CV</Text>
              </TouchableOpacity>,
              moment(user.created_at).format('DD.MM.YYYY'),
            ]}
            style={styles.dataRowStyle}
            textStyle={styles.dataTextStyle}
          />
        ))}
      </Table>

      <View style={styles.paginationContainer}>

        <TouchableOpacity onPress={goToPreviousPage}>
          <Text style={styles.paginationButton}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.pageText}>
           {page} of {totalPages}
        </Text>

 
        <TouchableOpacity onPress={goToNextPage}>
          <Text style={styles.paginationButton}>{'>'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#999999',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  filterInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#999999',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  tableBorderStyle: {
    borderWidth: 1,
    borderColor: '#999999',
  },
  headerRowStyle: {
    height: 50,

  },
  headerTextStyle: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  dataRowStyle: {
    height: 40,
  },
  dataTextStyle: {
    textAlign: 'center',
  },
  cvLink: {
    textDecorationLine: 'underline',
  },
  cvLinkText: {
    color: '#007bff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  paginationButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#007bff',
    color: '#ffffff',
    fontWeight: 'bold',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  pageText: {
    fontWeight: 'bold',
    marginHorizontal: 5,
    marginTop:5
  },
});

export default UsersTable;