import {
  CSSVariablesResolver,
  Container,
  createTheme, rem
} from '@mantine/core';

import containerClasses from './customStyles/Container.module.css';


export const theme = createTheme({
  /* Put your mantine theme override here */
  primaryColor: 'gray',
  primaryShade: 8,
  defaultRadius: 'lg',

  components: {
    Container: Container.extend({
      defaultProps: {
        size: 'xl',
      },
      classNames: {
        root: containerClasses.root,
      },
    }),
  },

  other: {
  }
});


export const variablesResolver: CSSVariablesResolver = (theme) => ({
  variables: {
    /****************
     * Font sizes
     ****************/

    // Display
    '--mantine-font-size-display': rem(72),
    '--mantine-line-height-display': rem(90),

    /****************
    * Spacing
    ****************/
    '--mantine-spacing-super-md': rem(64),
    '--mantine-spacing-super-lg': rem(96),

    /****************
    * Vertical padding of section
    ****************/
    '--mantine-spacing-section-paddingY-desktop_large': rem(96),
    '--mantine-spacing-section-paddingY-mobile_large': rem(32),

    /****************
    * Gap betweeen subcomponentes of a section
    ****************/
    '--mantine-spacing-section-gap-desktop_large': rem(64),
    '--mantine-spacing-section-gap-mobile_large': rem(32),
  },
  light: {
    // '--mantine-color-deep-orange': theme.other.deepOrangeLight,
  },
  dark: {
    // '--mantine-color-deep-orange': theme.other.deepOrangeDark,
  },
});