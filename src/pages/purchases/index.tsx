import { Avatar, Input, Box, Button, ButtonGroup, Divider, Flex, Heading, HStack, Icon, IconButton, Modal, ModalBody, ModalContent, ModalOverlay, SimpleGrid, Table, Tbody, Td, Text, Th, Thead, Tr, VStack, UnorderedList, ListItem, FormLabel, Select, FormErrorMessage } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { GetServerSideProps } from "next";
import * as yup from 'yup';
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { RiAddLine, RiEdit2Line, RiDeleteBin6Line, RiSearch2Line, RiDeleteBack2Fill, RiChatDeleteFill } from "react-icons/ri";
import { InputComponent } from "../../components/Form/Input";
import { Header } from "../../components/Header";
import { SideBar } from "../../components/Sidebar";
import { api, createApi } from "../../services/api";
import { toast } from "react-toastify";
import { Product } from "../../types/product";
import { Purchases } from "../../types/purchases";
import { Client } from "../../types/client";
import { ItemPurchase } from '../../types/ItemPurchases'
import Link from "next/link";

interface ProductListProps {
    purchases: Purchases[]
}

export default function PurchaseList({ purchases }: ProductListProps) {
    const api = createApi()

    const [allpurchases, setAllpurchases] = useState<Purchases[]>(purchases)

    async function deletePurchase(id: number) {
        try {
            api.delete(`/purchase?id=${id}`).then(() => {
                const filteredAllpurchases = allpurchases.filter((purchase) => purchase.id !== id);
                setAllpurchases(filteredAllpurchases)
                toast.success("Produto deletado com sucesso!");
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Box>
            <Header />

            <Flex
                w="100%"
                my="6"
                maxWidth={1480}
                mx="auto"
                px="6"
            >
                <SideBar />

                <Box
                    flex="1"
                    borderRadius={8}
                    bg="gray.800"
                    p="8"
                    maxHeight="80vh"
                >
                    <Flex mb="8" justify="space-between" align="center">
                        <Heading size="lg" fontWeight="normal">
                            Vendas
                        </Heading>

                        <Link
                            href={'/purchases/create/-1'}
                        >
                            <Button
                                as="a"
                                size="sm"
                                colorScheme="pink"
                                leftIcon={<Icon as={RiAddLine} />}
                                onClick={() => { }}
                            >
                                Cadastrar nova
                            </Button>
                        </Link>
                    </Flex>

                    {
                        !allpurchases.length ?
                            <Text color="gray.300">
                                Nenhuma venda encontrada
                            </Text>
                            :
                            <Box
                                height="85%"
                                overflow="auto"

                                css={{
                                    '&::-webkit-scrollbar': {
                                        width: '4px',
                                    },
                                    '&::-webkit-scrollbar-track': {
                                        width: '6px',
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        borderRadius: '24px',
                                        background: "#888888",
                                    },
                                }}

                            >
                                <Table
                                    colorScheme="gray"
                                >
                                    <Thead>
                                        <Tr>
                                            <Th>
                                                Cliente
                                            </Th>
                                            <Th>
                                                Valor total
                                            </Th>
                                            <Th>
                                                Produtos
                                            </Th>
                                            <Th>
                                                Data
                                            </Th>
                                            <Th>
                                                Ações
                                            </Th>
                                        </Tr>
                                    </Thead>

                                    <Tbody>

                                        {
                                            allpurchases.map(product => (
                                                <Tr key={product.id}>
                                                    <Td>
                                                        <Box>
                                                            <Text
                                                                color="white"
                                                            >
                                                                {product.Client.name}
                                                            </Text>
                                                        </Box>
                                                    </Td>
                                                    <Td>
                                                        <Box>
                                                            <Text
                                                                fontSize="sm"
                                                                color="white"
                                                            >
                                                                {
                                                                    new Intl.NumberFormat('pt-BR', {
                                                                        style: 'currency',
                                                                        currency: 'BRL',
                                                                    }).format(
                                                                        product?.value
                                                                    )
                                                                }
                                                            </Text>
                                                        </Box>
                                                    </Td>
                                                    <Td>
                                                        <Box>
                                                            <UnorderedList
                                                                fontSize="sm"
                                                                color="white"
                                                            >
                                                                {
                                                                    product.ItemPurchase.map((item) =>
                                                                        <ListItem>
                                                                            {item?.product?.name}
                                                                            &nbsp;-&nbsp;
                                                                            R$ {
                                                                                new Intl.NumberFormat('pt-BR', {
                                                                                    style: 'currency',
                                                                                    currency: 'BRL',
                                                                                }).format(
                                                                                    item.product.value
                                                                                )
                                                                            }
                                                                            &nbsp;-&nbsp;
                                                                            {item.qntd}x
                                                                        </ListItem>
                                                                    )
                                                                }
                                                            </UnorderedList>
                                                        </Box>
                                                    </Td>
                                                    <Td>
                                                        <Box>
                                                            <Text
                                                                fontSize="sm"
                                                                color="white"
                                                            >
                                                                {new Date(product.dtCreated).toLocaleDateString('en-GB')}
                                                            </Text>
                                                        </Box>
                                                    </Td>
                                                    <Td>
                                                        <ButtonGroup
                                                            gap={2}
                                                        >
                                                            <Link
                                                                href={`/purchases/edit/${product.id}`}
                                                            >
                                                                <IconButton
                                                                    colorScheme='yellow'
                                                                    aria-label='Search database'
                                                                    onClick={() => { }}
                                                                    icon={<RiEdit2Line />}
                                                                    fontSize='20px'
                                                                />
                                                            </Link>
                                                            <IconButton
                                                                colorScheme='red'
                                                                aria-label='Search database'
                                                                icon={<RiDeleteBin6Line />}
                                                                fontSize='20px'
                                                                onClick={() => deletePurchase(product.id)}
                                                            />
                                                        </ButtonGroup>
                                                    </Td>
                                                </Tr>
                                            ))
                                        }
                                    </Tbody>
                                </Table>
                            </Box>
                    }

                </Box>
            </Flex>
        </Box>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {

    const api = createApi(ctx)

    const {
        ['@dashGo:user']: tempUser
    } = parseCookies(ctx);

    const user = JSON.parse(tempUser ?? "{}");
    const { token } = user;

    if (!token) {
        return {
            redirect: {
                destination: '/',
                permanent: true,
            }
        }
    }

    const purchases: Purchases[] = []

    try {
        const { data } = await api.get<Purchases[]>('/purchases/all')

        data.sort((a, b) => a.dtCreated > b.dtCreated ? 1 : -1)
        purchases.push(...data)

    } catch (error: any) {
        console.log(error)
    }

    return {
        props: {
            purchases
        }
    }
}