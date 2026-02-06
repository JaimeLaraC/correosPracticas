export interface Company {
  id: number;
  name: string;
  sector: string;
  location: string;
  email: string;
  description: string;
  mathApplication: string;
}

export interface ThemeConfig {
  name: string;
  bgApp: string;
  container: string;
  header: {
    wrapper: string;
    title: string;
    subtitle: string;
    stats: string;
    statItem: string;
    tag: string;
  };
  filterBar: {
    wrapper: string;
    input: string;
    sectorContainer: string; // New property
    chipActive: string;
    chipInactive: string;
    resultsText: string;
  };
  card: {
    wrapper: string;
    number: string;
    title: string;
    badges: {
      sector: string;
      location: string;
    };
    button: string;
    buttonCopied: string;
    description: string;
    mathApp: string;
  };
  font: string;
}