import { Text, theme, ChakraProvider } from '@chakra-ui/react';
import { Hero } from './components/Hero';
import { Container } from './components/Container';
import { DarkModeSwitch } from './components/DarkModeSwitch';
import { Footer } from './components/Footer';
import { Options } from './components/Options';

const App = () => (
  <ChakraProvider theme={theme}>
    <Container height='100vh'>
      <Hero />
      <Options />
      <DarkModeSwitch />
      <Footer>
        <Text>❤️ Chakra & Tauri</Text>
      </Footer>
    </Container>
  </ChakraProvider>
);

export default App;
