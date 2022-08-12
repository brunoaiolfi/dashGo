import { Box, Button, Checkbox, Flex, Heading, Icon, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue } from "@chakra-ui/react";
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from "react";
import { RiAddLine } from "react-icons/ri";
import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { SideBar } from "../../components/Sidebar";
import { api } from "../../services/api";

type User = {
    id: string;
    name: string;
    email: string;
    createdAt: string;
}

export default function UserList() {

    const [page, setPage] = useState(1)

    const iswideVersion = useBreakpointValue({
        base: false,
        lg: true
    })

    const { data, isLoading, isError, isFetching } = useQuery(['users', page], () => getUsers(page), { staleTime: 8000 })

    async function getUsers(page: number) {
        try {
            const { data, headers } = await api.get('http://localhost:3000/api/users', {
                params: {
                    page
                }
            })

            const totalCount = Number(headers['x-total-count'])

            const users: User[] = data.users.map(user => {
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    createdAt: new Date(user.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                    })
                }
            })

            return {
                users: users,
                totalCount: totalCount
            };

        } catch (error: any) {
            console.log(error.response.message)
        }
    }

    return (

        <Box>
            <Header />

            <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6" >
                <SideBar />

                <Box flex="1" borderRadius={8} bg="gray.800" p="8" >
                    <Flex mb="8" justify="space-between" align="center">
                        <Heading size="lg" fontWeight="normal">
                            Usuários

                            {!isLoading && isFetching && <Spinner ml={4} size="sm" />}
                        </Heading>
                        <Link href="/users/create" passHref>
                            <Button
                                as="a"
                                size="sm"
                                colorScheme="pink"
                                leftIcon={<Icon as={RiAddLine} />}
                            >
                                Criar novo
                            </Button>
                        </Link>
                    </Flex>

                    {
                        isLoading ?
                            <Flex alignItems="center" justifyContent="center">
                                <Spinner size="md" colorScheme="pink" />
                            </Flex>
                            :
                            isError ?
                                <Text>
                                    Erro ao carregar usuários
                                </Text>
                                :
                                <>
                                    <Table colorScheme="whiteAlpha">
                                        <Thead>
                                            <Tr>
                                                <Th px={["4", "4", "6"]} color="gray.300" w="8">
                                                    <Checkbox colorScheme="pink" />
                                                </Th>
                                                <Th>
                                                    Usuário
                                                </Th>
                                                {
                                                    iswideVersion &&
                                                    <Th>
                                                        Data de cadastro
                                                    </Th>
                                                }
                                            </Tr>
                                        </Thead>

                                        <Tbody>

                                            {
                                                data.users.map(user => (
                                                    <Tr key={user.id}>
                                                        <Td px="6">
                                                            <Checkbox colorScheme="pink" />
                                                        </Td>
                                                        <Td>
                                                            <Box>
                                                                <Text fontWeight="bold">
                                                                    {user.name}
                                                                </Text>
                                                                <Text fontSize="sm" color="gray.300">
                                                                    {user.email}
                                                                </Text>

                                                            </Box>
                                                        </Td>
                                                        {
                                                            iswideVersion &&
                                                            <Td>
                                                                {user.createdAt}
                                                            </Td>
                                                        }
                                                    </Tr>
                                                ))
                                            }
                                        </Tbody>
                                    </Table>
                                    <Pagination
                                        totalCount={data.totalCount}
                                        currentPage={page}
                                        onPageChange={setPage}
                                    />
                                </>

                    }
                </Box>

            </Flex>
        </Box>
    )
}