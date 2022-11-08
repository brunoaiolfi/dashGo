import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { User } from "../../types/user";

interface ProfileProps {
    user?: User;
}

export function HeaderProfile({ user }: ProfileProps) {
    return (
        <Flex
            align={'right'}>
            <Box mr="4" textAlign="right">
                <Text >{user?.name ?? 'Nome não identificado!'}</Text>
                <Text color="gray.300" fontSize="sm">{user?.email ?? 'Email não identificado!'}</Text>
            </Box>
            <Avatar
                size="md"
                name={user?.name ?? "User avatar"}
                src={user?.avatarUrl}
            />

        </Flex >
    )
}