import React, { useEffect, useState } from 'react';
import {
  Button,
  VStack,
  Switch,
  FormControl,
  FormLabel,
  Flex,
  Text,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Slider,
  SliderFilledTrack,
  SliderTrack,
  SliderThumb,
} from '@chakra-ui/react';
import { open } from '@tauri-apps/api/dialog';
import { readDir } from '@tauri-apps/api/fs';
import { invoke } from '@tauri-apps/api/tauri';
import { FaFolderOpen, FaGitkraken } from 'react-icons/fa';
import { useToast } from '@chakra-ui/react';

export const Options = () => {
  const [value, setValue] = useState({
    useOfficialArt: false,
    reminderText: false,
    debugOp: false,
    threadsOp: false,
    borderOp: false,
    artistOutline: false,
    copyRight: false,
  });
  const [isJava, setJava] = useState(true);
  const [folderLoc, setFolder] = useState(false);
  const [threadCount, setThreads] = React.useState(10);
  const toast = useToast();

  useEffect(() => {
    checkForJava();
  }, []);

  const handleSubmit = async () => {
    const {
      useOfficialArt,
      reminderText,
      debugOp,
      threadsOp,
      borderOp,
      artistOutline,
      copyRight,
    } = value;
    invoke('exec_proximity', {
      folderLoc: folderLoc,
      useOfficialArt: JSON.stringify(useOfficialArt),
      reminderText: JSON.stringify(reminderText),
      debugOp: JSON.stringify(debugOp),
      threadsOp: JSON.stringify(threadsOp),
      borderOp: JSON.stringify(borderOp),
      artistOutline: JSON.stringify(artistOutline),
      copyRight: JSON.stringify(copyRight),
    });
  };

  const handleChange = (count) => setThreads(count);

  const handleClick = async () => {
    const file_loc = await open({ multiple: false, directory: true });
    if (file_loc) {
      console.log(file_loc);
      const files = await readDir(file_loc);
      console.log(files);
    }
    setFolder(file_loc);
  };

  const checkForJava = () => {
    invoke('check_for_java')
      .then((res) => {
        if (res) {
          toast({
            title: 'Java Check',
            description: 'Java is installed you can use proximity!',
            status: 'success',
            duration: 4000,
            isClosable: true,
          });
          setJava(false);
        } else {
          toast({
            title: 'Java Check',
            description: 'Java not found, please check that it is installed!',
            status: 'error',
            duration: 4000,
            isClosable: true,
          });
        }
      })
      .catch((e) => console.error(e));
  };

  return (
    <>
      <VStack spacing='15px'>
        <Button
          leftIcon={<FaFolderOpen />}
          size='md'
          colorScheme='teal'
          variant='outline'
          w='180px'
          type='submit'
          isDisabled={isJava}
          onClick={handleClick}
        >
          Proximity location
        </Button>
        {/* <FormControl display='flex' alignItems='center'>
          <FormLabel htmlFor='official_art' w='100%' mb='0'>
            Use Official Art
          </FormLabel>
          <Switch
            onChange={(e) =>
              setValue({ ...value, useOfficialArt: e.target.checked })
            }
            colorScheme='teal'
            id='official_art'
          />
        </FormControl> */}
        <FormControl display='flex' alignItems='center'>
          <FormLabel htmlFor='reminder_text' w='100%' mb='0'>
            Reminder Text
          </FormLabel>
          <Switch
            onChange={(e) =>
              setValue({ ...value, reminderText: e.target.checked })
            }
            colorScheme='teal'
            id='reminder_text'
          />
        </FormControl>
        <FormControl display='flex' alignItems='center'>
          <FormLabel htmlFor='debug' w='100%' mb='0'>
            Debug
          </FormLabel>
          <Switch
            onChange={(e) => setValue({ ...value, debugOp: e.target.checked })}
            colorScheme='teal'
            id='debug'
          />
        </FormControl>
        {/* <FormControl display='flex' alignItems='center'>
          <FormLabel htmlFor='border' w='100%' mb='0'>
            Border
          </FormLabel>
          <Switch
            onChange={(e) => setValue({ ...value, borderOp: e.target.checked })}
            colorScheme='teal'
            id='border'
          />
        </FormControl> */}
        {/* <FormControl display='flex' alignItems='center'>
          <FormLabel htmlFor='artist_outline' w='100%' mb='0'>
            Artist Outline
          </FormLabel>
          <Switch
            onChange={(e) =>
              setValue({ ...value, artistOutline: e.target.checked })
            }
            colorScheme='teal'
            id='artist_outline'
          />
        </FormControl> */}
        <FormControl display='flex' alignItems='center'>
          <FormLabel htmlFor='copyright' w='100%' mb='0'>
            Copyright
          </FormLabel>
          <Switch
            onChange={(e) =>
              setValue({ ...value, copyRight: e.target.checked })
            }
            colorScheme='teal'
            id='copyright'
          />
        </FormControl>
        <Flex>
          <Text mr='2rem'>Thread count</Text>
          <NumberInput
            maxW='100px'
            defaultValue={10}
            min={10}
            mr='2rem'
            size='sm'
            value={threadCount}
            onChange={handleChange}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Slider
            aria-label='thread count'
            flex='1'
            width='200px'
            defaultValue={10}
            min={10}
            size='sm'
            focusThumbOnChange={false}
            value={threadCount}
            onChange={handleChange}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb fontSize='sm' boxSize={5} children={threadCount} />
          </Slider>
        </Flex>
        <Button
          leftIcon={<FaGitkraken />}
          size='md'
          w='180px'
          colorScheme='teal'
          variant='outline'
          type='submit'
          isDisabled={!folderLoc}
          onClick={handleSubmit}
        >
          Run proximity!
        </Button>
      </VStack>
    </>
  );
};
