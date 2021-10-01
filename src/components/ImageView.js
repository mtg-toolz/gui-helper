import {
  Image,
  SimpleGrid,
  Box,
  Button,
  useColorModeValue,
  Spinner,
} from '@chakra-ui/react';
import { open } from '@tauri-apps/api/dialog';
import { readDir } from '@tauri-apps/api/fs';
import { currentDir } from '@tauri-apps/api/path';
import { FaFolderOpen } from 'react-icons/fa';
import React, { useState } from 'react';
import CardHolder from './CardHolder';

function ImageView() {
  // eslint-disable-next-line no-unused-vars
  const [folderLoc, setFolder] = useState(false);
  const [isLoading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [fileList, setFiles] = useState(null);
  const [imageFiles, setImages] = useState([]);
  const [renderFiles, setRender] = useState({
    imageName: '',
    altImages: [],
  });
  const color = useColorModeValue('black', 'teal');

  const handleClick = async () => {
    console.log(await currentDir());
    const file_loc = await open({ multiple: false, directory: true });
    let files;
    if (file_loc) {
      files = await readDir(file_loc, { recursive: true });
      setFiles(files);
    }
    setFolder(file_loc);
    setLoading(true);
    await checkForFiles(files);
    setLoading(false);
  };

  const flattenItems = (xs) =>
    xs.flatMap(({ children, ...node }) => [
      node,
      ...flattenItems(children || []),
    ]);

  const checkForFiles = async (files) => {
    const flat = flattenItems(files);
    //.name and .path
    setImages(flat);
    // if (files) {
    //   files = files.flat();
    //   files.forEach((file) => {
    //     // console.log(file.name);
    //   });
    // }
  };

  return (
    <>
      <Button
        leftIcon={<FaFolderOpen />}
        size='md'
        colorScheme={color}
        variant='outline'
        w='180px'
        type='submit'
        onClick={handleClick}
      >
        Image Folder
      </Button>
      <SimpleGrid minChildWidth='120px' spacing='40px'>
        {!isLoading ? <Spinner /> : <CardHolder images={imageFiles} />}
      </SimpleGrid>
    </>
  );
}

export default ImageView;
