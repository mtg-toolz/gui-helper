/* eslint-disable array-callback-return */
import React from 'react';
import { Box, Image } from '@chakra-ui/react';

const CardHolder = (images) => {
  console.log(images);
  return (
    <>
      {images?.map((img) => {
        <Box boxSize='sm' key={img.name}>
          <Image src={img.path} alt={img.name} />
        </Box>;
      })}
    </>
  );
};

export default CardHolder;
