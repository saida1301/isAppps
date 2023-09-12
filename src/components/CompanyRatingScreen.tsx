import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, useColorScheme } from 'react-native';
import { View, Text } from 'react-native';
import { Svg, Rect, Text as SvgText } from 'react-native-svg';

const CompanyRatingScreen = ({ companyId }: any) => {
  const [ratingsData, setRatingsData] = useState([]);
  const chartWidth = 250;
  const chartHeight = 150;
  const barWidth = 30;
  const barMargin = 10;
  const isDarkMode = useColorScheme() === 'dark';
  const labelOffset = 40;
  const {t} = useTranslation();
  useEffect(() => {
    fetch(`https://movieappi.onrender.com/rating/${companyId}`)
      .then((response) => response.json())
      .then((data) => setRatingsData(data))
      .catch((error) => console.error(error));
  }, [companyId]);

  const maxDataValue = Math.max(...ratingsData.map((item) => item.count));
  const scaleX = chartWidth / maxDataValue;

  const ratingLabels = [5, 4, 3, 2, 1];

  return (
    <View style={{}}>
      {ratingsData.length > 0 ? (
        <View style={styles.container}>
          <View style={styles.ratingValuesContainer}>
            {ratingLabels.map((rating, index) => (
              <Text key={index} style={styles.ratingValueText}>
                {rating}
              </Text>
            ))}
          </View>
          <Svg width={chartWidth} height={chartHeight + labelOffset}>
            {ratingLabels.map((rating, index) => {
              const item = ratingsData.find((item) => item.rating === rating);
              const x = 0;
              const y = (barWidth + barMargin) * index;
              const filledWidth = item ? (item.count / maxDataValue) * chartWidth : 0;
              const height = barWidth;

              return (
                <React.Fragment key={index}>
                  <Rect
                    x={0}
                    y={y}
                    width={chartWidth}
                    height={barWidth}
                    fill="#DDDDDD"
                    rx={5}
                    ry={5}
                  />
                  <Rect
                    x={0}
                    y={y}
                    width={filledWidth}
                    height={height}
                    fill="#8843E1"
                    rx={5}
                    ry={5}
                  />
                  <SvgText
                    x={filledWidth + 10}
                    y={y + barWidth / 2}
                    fill="#000"
                    fontSize="12"
                    textAnchor="start"
                    alignmentBaseline="central"
                    opacity={filledWidth > 40 ? 1 : 0} // Hide text if too small
                  >
                    {item ? item.count : ''}
                  </SvgText>
                  <SvgText
                    x={-labelOffset}
                    y={y + barWidth / 2}
                    fill="#000"
                    fontSize="12"
                    textAnchor="end"
                    alignmentBaseline="central"
                  >
                    {rating}
                  </SvgText>
                  <SvgText
                    x={chartWidth + labelOffset - 10}
                    y={y + barWidth / 2}
                    fill="#000"
                    fontSize="12"
                    textAnchor="end"
                    alignmentBaseline="central"
                  >
                    {item ? item.count : ''}
                  </SvgText>
                </React.Fragment>
              );
            })}
          </Svg>
        </View>
      ) : (
        <Text style={{ color: isDarkMode ? 'white' : 'black',}}>{t('no_review')}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: 50,
    marginHorizontal: 20,
    transform: [{ rotate: '0deg' }],
  },
  ratingValuesContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 20,
    height: 175,
    marginRight: 20,
    alignSelf: 'center',
  },
  ratingValueText: {
    fontSize: 16,
     fontFamily: 'Montserrat', // Font family: Montserrat;
            // Font size: 40px;
    fontStyle: 'normal',     // Font style: normal;
    fontWeight: '700',       // Font weight: 700;
    lineHeight: 20,        
    color: 'black', 

  },
});

export default CompanyRatingScreen;