import { Flex, Icon, IconButton, useBreakpointValue } from '@chakra-ui/react';
import { RiMenuLine } from 'react-icons/ri';
import { useSidebarDrawer } from '../../contexts/SidebarDrawerContext';
import { HeaderLogo } from '../Logo';
import { HeaderNotificationsNav } from './NotificationsNav';
import { HeaderProfile } from './Profile';
import { HeaderSearchBox } from './SearchBox';

export function Header() {
    const { onOpen } = useSidebarDrawer()

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
                <HeaderProfile showProfileData={isWideVersion} />
            </Flex>
        </Flex>
    )
}