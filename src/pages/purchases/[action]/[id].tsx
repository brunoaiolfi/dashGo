import { Avatar, Input, Box, Button, ButtonGroup, Divider, Flex, Heading, HStack, Icon, IconButton, Modal, ModalBody, ModalContent, ModalOverlay, SimpleGrid, Table, Tbody, Td, Text, Th, Thead, Tr, VStack, UnorderedList, ListItem, FormLabel, Select, FormErrorMessage } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { GetServerSideProps } from "next";
import * as yup from 'yup';
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { RiAddLine, RiEdit2Line, RiDeleteBin6Line, RiSearch2Line, RiDeleteBack2Fill, RiChatDeleteFill } from "react-icons/ri";
import { InputComponent } from "../../../components/Form/Input";
import { Header } from "../../../components/Header";
import { SideBar } from "../../../components/Sidebar";
import { api, createApi } from "../../../services/api";
import { toast } from "react-toastify";
import { Product } from "../../../types/product";
import { Purchases } from "../../../types/purchases";
import { Client } from "../../../types/client";
import { ItemPurchase } from '../../../types/ItemPurchases'
import Link from "next/link";
import { useRouter } from "next/router";
interface ProductListProps {
    purchases: Purchases[]
}

export type itemsPurchasesToInput = {
    qntd: number;
    productId: number;
};


interface FormClientPurchases {
    clientId: number
}
interface FormItemsPurchases {
    items: itemsPurchasesToInput[]
}

interface Option {
    label: string,
    value: number,
}

const createUserSchema = yup.object().shape({
    clientId: yup.string().required('Cliente é obrigatório!'),
})


export default function PurchaseForm() {
    const api = createApi()
    const router = useRouter()

    const { register, handleSubmit, formState, reset } = useForm<FormClientPurchases>({
        resolver: yupResolver(createUserSchema)
    })

    const { register: registerItemToPurchase, control, watch: watchItemToPurchase } = useForm<FormItemsPurchases>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const { errors } = formState;
    const { action, id } = router.query


    const [allProducts, setAllProducts] = useState<Product[]>([])
    const [clientOptions, setClientsOptions] = useState<Option[]>([])
    const [productsOptions, setProductsOptions] = useState<Option[]>([])


    useEffect(() => {
        getClients()
        getProducts()

        if (action === "edit") {
            
        }
    }, [])

    async function submit({ clientId }: FormClientPurchases) {
        const tempItems = watchItemToPurchase('items') ?? []

        const formattedItems: itemsPurchasesToInput[] = tempItems.map(({
            productId,
            qntd,
        }) => {
            return {
                productId: Number(productId),
                qntd: Number(qntd)
            }
        })

        switch (action) {
            case "create":
                createPurchases(Number(clientId), formattedItems).then(() => {
                    reset()
                })
                break;

            case "edit":
                break;
        }
    }

    async function createPurchases(clientId: number, itemsPurchases: itemsPurchasesToInput[]) {
        try {
            let totalValue = 0;

            itemsPurchases.map(({ productId, qntd }) => {
                totalValue += allProducts.find(({ id }) => productId === id).value * qntd
            })

            const { data } = await api.post<Purchases>('/purchases', {
                clientId,
                itemsPurchases,
                totalValue
            })
            toast.success("Produto cadastrado com sucesso!");
        } catch (error) {
            console.log(error)
        }
    }

    async function getClients() {
        try {
            const { data } = await api.get<Client[]>('/Client/All')

            const tempOptions: Option[] = data.map(({ id, name }) => {
                return {
                    label: name,
                    value: Number(id)
                }
            })

            setClientsOptions(tempOptions)
        } catch (error) {
            console.log(error)
        }
    }

    async function getProducts() {
        try {
            const { data } = await api.get<Product[]>('/Product/all')

            const tempOptions: Option[] = data.map(({ id, name }) => {
                return {
                    label: name,
                    value: Number(id)
                }
            })
            setAllProducts(data)
            setProductsOptions(tempOptions)
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
                            {action === "create" ? "Cadastrar nova" : "Editar"} venda
                        </Heading>
                    </Flex>

                    <Box
                        as="form"
                        w="100%"
                        onSubmit={handleSubmit(submit)}
                        flex="1"
                        borderRadius={8}
                        p="8"
                    >
                        <VStack spacing="8">
                            <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
                                <Flex
                                    flexDirection="column"
                                >
                                    <FormLabel htmlFor={"clientId"}>Cliente</FormLabel>
                                    <Select
                                        {...register('clientId', { required: true })}
                                        name={"clientId"}
                                        id={"clientId"}
                                        focusBorderColor='pink.500'
                                        bgColor="gray.900"
                                        variant={'filled'}
                                        _hover={{
                                            bgColor: 'gray.900'
                                        }}
                                        size="lg"

                                    >
                                        {
                                            clientOptions.map(({ label, value }) =>
                                                <option
                                                    style={{
                                                        background: "#181b23"
                                                    }}
                                                    value={value}
                                                >
                                                    {label}
                                                </option>
                                            )
                                        }
                                    </Select>
                                    {
                                        errors.clientId &&
                                        <FormErrorMessage>
                                            {errors.clientId.toString()}
                                        </FormErrorMessage>
                                    }

                                </Flex>
                            </SimpleGrid>

                            <Flex
                                w="100%"
                                justifyContent="space-between"
                            >
                                <Heading alignItems="left" size="lg" fontWeight="normal">
                                    Produtos comprados
                                </Heading>
                                <Flex
                                    gap="4"
                                >
                                    <Button
                                        as="a"
                                        size="sm"
                                        colorScheme="pink"
                                        leftIcon={<Icon as={RiAddLine} />}
                                        onClick={() => append({} as itemsPurchasesToInput)}
                                    >
                                        Novo produto
                                    </Button>
                                    <Button
                                        as="a"
                                        size="sm"
                                        colorScheme="red"
                                        leftIcon={<Icon as={RiDeleteBin6Line} />}
                                        onClick={() => remove(fields.length - 1)}
                                    >
                                        Remover último
                                    </Button>
                                </Flex>
                            </Flex>
                            <Box
                                w="100%"
                                h={200}
                                overflowY={"auto"}
                                display="flex"
                                flexDir="column"
                                gap={8}
                            >
                                {
                                    fields.map((item, index) => (
                                        <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
                                            <VStack
                                                align="left"
                                                spacing="0"
                                            >
                                                <FormLabel htmlFor={`items.${index}.productId`}>Produto</FormLabel>
                                                <Select
                                                    {...registerItemToPurchase(`items.${index}.productId`, { required: true })}
                                                    name={`items.${index}.productId`}
                                                    id={`items.${index}.productId`}
                                                    focusBorderColor='pink.500'
                                                    bgColor="gray.900"
                                                    variant={'filled'}
                                                    _hover={{
                                                        bgColor: 'gray.900'
                                                    }}
                                                    size="lg"
                                                >
                                                    {
                                                        productsOptions.map(({ label, value }) =>
                                                            <option
                                                                style={{
                                                                    background: "#181b23"
                                                                }}
                                                                value={value}
                                                            >
                                                                {label}
                                                            </option>
                                                        )
                                                    }
                                                </Select>
                                            </VStack>

                                            <InputComponent
                                                name="qntd"
                                                label="Quantidade"
                                                type="number"
                                                step="1"
                                                {...registerItemToPurchase(`items.${index}.qntd`, { required: true })}
                                            />

                                        </SimpleGrid>
                                    ))
                                }

                            </Box>
                        </VStack>

                        <Flex
                            mt="12"
                            justify="flex-end"
                        >
                            <HStack spacing="4">
                                <Link
                                    href={'/purchases/'}
                                >
                                    <Button colorScheme="gray"> Cancelar</Button>
                                </Link>
                                <Button type="submit" colorScheme="pink"> Salvar</Button>
                            </HStack>
                        </Flex>
                    </Box>
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

    return {
        props: {}
    }
}