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
  useColorModeValue,
} from '@chakra-ui/react';
import { open } from '@tauri-apps/api/dialog';
import { readDir } from '@tauri-apps/api/fs';
import { invoke } from '@tauri-apps/api/tauri';
import { currentDir } from '@tauri-apps/api/path';
import { FaFolderOpen, FaGitkraken } from 'react-icons/fa';
import { useToast } from '@chakra-ui/react';

export const Options = () => {
  const color = useColorModeValue('black', 'teal');
  const [value, setValue] = useState({
    useOfficialArt: false,
    reminderText: false,
    debugOp: false,
    borderOp: 'black',
    artistOutline: false,
    copyRight: false,
  });
  const [isJava, setJava] = useState(true);
  const [folderLoc, setFolder] = useState(false);
  const [threadCount, setThreads] = useState(10);
  const [fileList, setFiles] = useState(null);
  const [isZip, setZip] = useState(false);
  const [isTemp, setTemp] = useState(false);
  const [isTxt, setTxt] = useState(false);
  const [prox_ver, setProx] = useState('');
  const [deckFile, setDeck] = useState('');
  const toast = useToast();
  const regexZip = new RegExp('template.zip', 'gm');
  const regexTemp = new RegExp('(?=template)^((?!zip).)*$', 'gm');
  const regexTxt = new RegExp('.txt', 'g');
  const regexProxy = new RegExp('proximity.*(?=jar)', 'gmi');

  //Checks for java on load to enable or disable buttons
  useEffect(() => {
    checkForJava();
  }, []);

  /**
   * Send values to rust backend to create the cli command based on users selections and normal default options.
   */
  const handleSubmit = async () => {
    const {
      useOfficialArt,
      reminderText,
      debugOp,
      borderOp,
      artistOutline,
      copyRight,
    } = value;
    await invoke('exec_proximity', {
      folderLoc: folderLoc,
      proximity: prox_ver,
      deckFile: deckFile,
      isZip: JSON.stringify(isZip),
      useOfficialArt: JSON.stringify(useOfficialArt),
      reminderText: JSON.stringify(reminderText),
      debugOp: JSON.stringify(debugOp),
      threadsOp: JSON.stringify(threadCount),
      borderOp: borderOp,
      artistOutline: JSON.stringify(artistOutline),
      copyrightOp: JSON.stringify(copyRight),
    });

    //reset encase users had issues
    setFolder(false);
    setFiles(null);
    setTemp(false);
    setZip(false);
    setTxt(false);
  };

  //Handle for thread slider value change
  const handleChange = (count) => setThreads(count);

  /**
   * Simply grabs the folder the user selects
   */
  const handleClick = async () => {
    console.log(await currentDir());
    const file_loc = await open({ multiple: false, directory: true });
    let files;
    if (file_loc) {
      files = await readDir(file_loc);
      setFiles(files);
    }
    setFolder(file_loc);
    await checkForFiles(files);
    console.log(isTemp, isZip, isTxt);
  };

  /**
   * Checking for file template and text file for deck lists.
   */
  const checkForFiles = async (files) => {
    if (files) {
      files = files.flat();
      files.forEach((file) => {
        console.log(file.name);
        //check for temp folder if true check for if it is zipped.
        if (regexTemp.test(file.name)) {
          console.log('temp check');
          setTemp(true);
        }
        if (regexProxy.test(file.name)) {
          setProx(file.name);
        }
        if (regexZip.test(file.name)) {
          console.log('zip check');
          setZip(true);
        }
        if (regexTxt.test(file.name)) {
          console.log('txt check');
          setDeck(file.name);
          setTxt(true);
        }
      });
    }
  };

  //Will check for java in the rust backend and based on response alert the user: DOES NOT CARE ABOUT VER CURRENTLY!
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

  //Main render that likely should be broken up : TODO
  return (
    <>
      <VStack spacing='15px'>
        <Button
          leftIcon={<FaFolderOpen />}
          size='md'
          colorScheme={color}
          variant='outline'
          w='180px'
          type='submit'
          isDisabled={isJava}
          onClick={handleClick}
        >
          Proximity location
        </Button>
        <FormControl display='flex' alignItems='center'>
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
        </FormControl>
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
        <FormControl display='flex' alignItems='center'>
          <FormLabel htmlFor='border' w='100%' mb='0'>
            Border None
          </FormLabel>
          <Switch
            onChange={(e) => setValue({ ...value, borderOp: e.target.checked })}
            colorScheme='teal'
            id='border'
          />
        </FormControl>
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
          colorScheme={color}
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
