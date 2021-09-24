import { Flex, Heading } from '@chakra-ui/react';

export const Hero = ({ title }) => (
  <Flex
    justifyContent='center'
    alignItems='center'
    height='50vh'
    bgGradient='linear(to-l, #7928CA, #FF0080)'
    bgClip='text'
  >
    <Heading fontSize='4Vw'>{title}</Heading>
  </Flex>
);

Hero.defaultProps = {
  title: 'Proximity Helper',
};
