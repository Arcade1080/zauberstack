import {
  CSSVariablesResolver,
  Table,
  Checkbox,
  Drawer,
  createTheme,
  mergeThemeOverrides,
} from '@mantine/core';
import checkboxClasses from './Checkbox.module.css';
import drawerClasses from './Drawer.module.css';
import tableClasses from './DataTable.module.css';

const baseTheme = createTheme({
  /* Put your mantine theme override here */
  primaryColor: 'gray',
  primaryShade: 8,
  defaultRadius: 'lg',
  components: {
    // checkboxes should be independent from  the defaultRadius setting
    Checkbox: Checkbox.extend({
      classNames: {
        input: checkboxClasses.input,
      },
    }),
    Drawer: Drawer.extend({
      classNames: {
        title: drawerClasses.title,
      },
    }),
    Table: Table.extend({
      classNames: {
        thead: tableClasses.header,
        td: tableClasses.td,
      },
    }),
    // Button: Button.extend({
    //   defaultProps: {
    //     color: 'cyan',
    //     variant: 'outline',
    //   },
    // }),
  },
});

const customVariables = createTheme({
  other: {
    bgNavigation: {
      light: '#F8F9FA',
      dark: 'red',
    },
  },
});

// Merge themes
// https://mantine.dev/theming/theme-object/#store-theme-override-object-in-a-variable
export const theme = mergeThemeOverrides(baseTheme, customVariables);

// Make custom variables availavle
// https://mantine.dev/styles/css-variables/#css-variables-resolver
export const cssVarResolver: CSSVariablesResolver = (currentTheme) => ({
  variables: {
    '--mantine-bg-navigation': currentTheme.other.bgNavigation,
  },
  light: {
    '--mantine-bg-navigation': currentTheme.other.bgNavigation,
  },
  dark: {
    '--mantine-bg-navigation': currentTheme.other.bgNavigation,
  },
});
