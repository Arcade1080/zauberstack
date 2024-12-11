import { ApolloProvider } from '@apollo/client';
import { MantineProvider } from '@mantine/core';
//https://icflorescu.github.io/mantine-datatable/styling/
import '@mantine/notifications/styles.layer.css';
import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';
import './layout.css';

import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import AuthContextProvider from './context/AuthContextProvider';
import apolloClient from './lib/apolloClient';
import Router from './routes/Router';
import { cssVarResolver, theme } from './theme/theme';

export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <MantineProvider theme={theme} cssVariablesResolver={cssVarResolver}>
        <AuthContextProvider>
          <Notifications />
          <ModalsProvider>
            <Router />
          </ModalsProvider>
        </AuthContextProvider>
      </MantineProvider>
    </ApolloProvider>
  );
}
