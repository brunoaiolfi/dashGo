import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { useAuth } from "../../contexts/AuthContext";

interface ProfileProps {
    showProfileData: boolean;
}
export function HeaderProfile({ showProfileData }: ProfileProps) {

    const { user } = useAuth()

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
                size="md"
                name="Bruno Aiolfi"
                src="https://github.com/brunoaiolfi.png"
            />
        </Flex>
    )
}