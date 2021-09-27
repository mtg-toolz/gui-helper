import { theme, ChakraProvider, Link, HStack } from '@chakra-ui/react';
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
        <HStack spacing='10px'>
          <Link
            color='blue'
            href='https://github.com/Haven-King/Proximity/releases'
            isExternal
          >
            ❤️ Proximity(Haven-King)
          </Link>
          <Link color='blue' href='https://chakra-ui.com/' isExternal>
            & Chakra UI
          </Link>
          <Link color='blue' href='https://tauri.studio/en/' isExternal>
            & Tauri
          </Link>
        </HStack>
      </Footer>
    </Container>
  </ChakraProvider>
);

export default App;
