import React from 'react';
import {
  Button,
  VStack,
  Switch,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { open } from '@tauri-apps/api/dialog';
import { readDir } from '@tauri-apps/api/fs';
import { FaFolderOpen, FaGitkraken } from 'react-icons/fa';

export const Options = () => {
  const [value, setValue] = React.useState({
    use_official_art: false,
    reminder_text: false,
    debug: false,
    threads: false,
    border: false,
    artist_outline: false,
    copyright: false,
  });
  const invoke = window.__TAURI__.invoke;

  const handleClick = async () => {
    const file_loc = await open({ multiple: false, directory: true });
    if (file_loc) {
      console.log(file_loc);
      const files = await readDir(file_loc);
      console.log(files);
    }
  };

  invoke('check_for_java');
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
              setValue({ ...value, use_official_art: e.target.checked })
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
              setValue({ ...value, reminder_text: e.target.checked })
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
            onChange={(e) => setValue({ ...value, debug: e.target.checked })}
            colorScheme='teal'
            id='debug'
          />
        </FormControl>
        <FormControl display='flex' alignItems='center'>
          <FormLabel htmlFor='threads' w='100%' mb='0'>
            Threads
          </FormLabel>
          <Switch
            onChange={(e) => setValue({ ...value, threads: e.target.checked })}
            colorScheme='teal'
            id='threads'
          />
        </FormControl>
        <FormControl display='flex' alignItems='center'>
          <FormLabel htmlFor='border' w='100%' mb='0'>
            Border
          </FormLabel>
          <Switch
            onChange={(e) => setValue({ ...value, border: e.target.checked })}
            colorScheme='teal'
            id='border'
          />
        </FormControl>
        <FormControl display='flex' alignItems='center'>
          <FormLabel htmlFor='artist_outline' w='100%' mb='0'>
            Artist Outline
          </FormLabel>
          <Switch
            onChange={(e) =>
              setValue({ ...value, artist_outline: e.target.checked })
            }
            colorScheme='teal'
            id='artist_outline'
          />
        </FormControl>
        <FormControl display='flex' alignItems='center'>
          <FormLabel htmlFor='copyright' w='100%' mb='0'>
            Copyright
          </FormLabel>
          <Switch
            onChange={(e) =>
              setValue({ ...value, copyright: e.target.checked })
            }
            colorScheme='teal'
            id='copyright'
          />
        </FormControl>
        <Button
          leftIcon={<FaGitkraken />}
          size='md'
          w='180px'
          colorScheme='teal'
          variant='outline'
          type='submit'
        >
          Run proximity!
        </Button>
      </VStack>
    </>
  );
};
