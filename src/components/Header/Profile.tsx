import { Avatar, Box, Button, Flex, HStack, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { ImExit, ImCancelCircle } from "react-icons/im";

interface ProfileProps {
    showProfileData: boolean;
}
export function HeaderProfile({ showProfileData }: ProfileProps) {

    const { user, singOut } = useAuth()

    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <Flex
            align={'right'}>
            {
                showProfileData &&
                <Box mr="4" textAlign="right">
                    <Text >{user?.name ?? 'Nome não identificado!'}</Text>
                    <Text color="gray.300" fontSize="sm">{user?.email ?? 'Email não identificado!'}</Text>
                </Box>
            }
            <Avatar
                onClick={onOpen}
                size="md"
                name="Bruno Aiolfi"
                src="https://github.com/brunoaiolfi.png"
            />

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent p={2} bg="gray.800">
                    <ModalBody>
                        <HStack spacing="4">
                            <IconButton
                                w="100%"
                                h={128}
                                colorScheme='blackAlpha'
                                aria-label='Search database'
                                icon={<ImCancelCircle />}
                                fontSize='48px'
                                onClick={onClose}
                            />
                            <IconButton
                                w="100%"
                                h={128}
                                colorScheme='red'
                                aria-label='Search database'
                                fontSize='48px'
                                icon={<ImExit />}
                                onClick={singOut}
                            />
                        </HStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Flex>
    )
}