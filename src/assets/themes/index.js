export const colors = {
    primary: '#8843E1',
    secondary: '#71727A',
    white: '#FFFFFF',
    black: '#000000',
};
export const fontSizes = {
    small: 12,
    medium: 16,
    large: 20,
    xlarge: 26
};
export const flex = {
    flexDirection: 'row',
     alignItems: 'center',
   justifyContent:"space-around"
};
export const spacing = {
    small: 8,
    medium: 16,
    large: 24,
};

export const fonts = {
    regular: 'Inter',
    bold: 'Montserrat',
};

export const fontWeights = {
    regular: '400',
    bold: '800',
};

export const lightColors = {
    ...colors,
    background: '#FFFFFF',
    text: '#000000',
};
export const darkColors = {
    ...colors,
    background: '#000000',
    text: '#FFFFFF',
};

export const lightStyles = {
    container: {
        backgroundColor: lightColors.background,
    },
    text: {
        color: lightColors.text,
    },
};

export const borderRadius = {
    small: 12,
    medium: 15,
    large: 20,

};



export const darkStyles = {
    container: {
        backgroundColor: darkColors.background,
    },
    text: {
        color: darkColors.text,
    },
};

