import { Link, HStack } from '@chakra-ui/react';
import { Hero } from './Hero';
import { Container } from './Container';
import { DarkModeSwitch } from './DarkModeSwitch';
import { Footer } from './Footer';
import { Options } from './Options';

const Main = () => (
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
        <Link color='blue' href='https://github.com/chilli-axe' isExternal>
          & Autofill(Chilli-axe)
        </Link>
        <Link color='blue' href='https://github.com/Tarnop/CardXML' isExternal>
          & CardXML(Tarnop)
        </Link>
      </HStack>
    </Footer>
  </Container>
);

export default Main;
