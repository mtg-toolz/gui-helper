import { theme, ChakraProvider } from '@chakra-ui/react';
import {
  BrowserRouter as Router,
  Link as RouterLink,
  Switch,
  Route,
} from 'react-router-dom';
import ImageView from './components/ImageView';
import Main from './components/Main';

const App = () => (
  <ChakraProvider theme={theme}>
    <Router>
      {/* <RouterLink to='/'>Home</RouterLink>
      <RouterLink to='/cardselect'>Card Selector</RouterLink> */}
      <Switch>
        <Route exact path='/'>
          <Main />
        </Route>
        <Route path='/cardselect'>
          <ImageView />
        </Route>
      </Switch>
    </Router>
    ;
  </ChakraProvider>
);

export default App;
