import { Button, Flex, Icon, IconButton, Modal, ModalBody, ModalContent, ModalOverlay, useBreakpointValue, useDisclosure } from '@chakra-ui/react';
import { RiMenuLine } from 'react-icons/ri';
import { useAuth } from '../../contexts/AuthContext';
import { useSidebarDrawer } from '../../contexts/SidebarDrawerContext';
import { HeaderLogo } from '../Logo';
import { HeaderNotificationsNav } from './NotificationsNav';
import { HeaderProfile } from './Profile';
import { HeaderSearchBox } from './SearchBox';
import { FormEditUser } from './FormEditUser';

export function Header() {
    const { onOpen } = useSidebarDrawer()
    const { user } = useAuth()
    const { isOpen, onOpen: openEditModalPopUp, onClose } = useDisclosure()

    const isWideVersion = useBreakpointValue({
        base: false,
        lg: true
    })

    return (
        <Flex
            as="header"
            w="100%"
            maxWidth={1480}
            h="20"
            mx="auto"
            mt="4"
            align="center"
            px="6"
        >
            {
                !isWideVersion && (
                    <IconButton
                        aria-label='Abrir menu'
                        icon={<Icon as={RiMenuLine} />}
                        onClick={onOpen}
                        fontSize="24"
                        variant="unstyled"
                        mr="2"
                    />
                )
            }
            <HeaderLogo />

            <Flex
                align={'center'}
                ml="auto"
            >
                <HeaderNotificationsNav />

                <Button
                    variant="unstyled"
                    onClick={openEditModalPopUp}
                >
                    <HeaderProfile user={{ ...user, password: '' }} />
                </Button>
            </Flex>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent alignItems="center" justifyContent="center" bg="none">
                    <ModalBody w={800} borderRadius={8}>
                        <FormEditUser close={onClose} user={{ ...user, password: '' }} />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Flex>
    )
}