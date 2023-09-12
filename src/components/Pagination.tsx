import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <View style={styles.paginationContainer}>
      {currentPage > 1 && (
        <TouchableOpacity onPress={() => handlePageChange(currentPage - 1)}>
          <Text style={styles.paginationButton}>{'<'}</Text>
        </TouchableOpacity>
      )}

      {pageNumbers.map((pageNumber) => (
        <TouchableOpacity
          key={pageNumber}
          onPress={() => handlePageChange(pageNumber)}
        >
          <Text
            style={[
              styles.paginationButton,
              currentPage === pageNumber && styles.activePaginationButton,
            ]}
          >
            {pageNumber}
          </Text>
        </TouchableOpacity>
      ))}

      {currentPage < totalPages && (
        <TouchableOpacity onPress={() => handlePageChange(currentPage + 1)}>
          <Text style={styles.paginationButton}>{'>'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  paginationButton: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 8,
    color: '#8843E1',
    borderRadius: 5,
  },
  activePaginationButton: {
    backgroundColor: '#8843E1',
    color: 'white',
  },
});

export default Pagination;
