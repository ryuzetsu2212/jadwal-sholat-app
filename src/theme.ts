export interface Theme {
  bg: string;
  card: string;
  text: string;
  subtext: string;
  primary: string;
  primaryText: string;
  border: string;
  highlight: string;
}

export const lightTheme: Theme = {
  bg: '#f4f7f5',
  card: '#ffffff',
  text: '#1a2b23',
  subtext: '#5f7a6d',
  primary: '#0d7a4f',
  primaryText: '#ffffff',
  border: '#e2ece7',
  highlight: '#e8f5ee',
};

export const darkTheme: Theme = {
  bg: '#0e1512',
  card: '#16211c',
  text: '#eef5f1',
  subtext: '#93a89c',
  primary: '#1fae6b',
  primaryText: '#06281a',
  border: '#24332c',
  highlight: '#1c2f26',
};
