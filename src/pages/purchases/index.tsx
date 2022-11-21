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

interface ProductListProps {
    purchases: Purchases[]
}

export type itemsPurchases = {
    qntd: number;
    productId: number;
};


interface FormClientPurchases {
    clientId: number
}
interface FormItemsPurchases {
    items: itemsPurchases[]
}

interface Option {
    label: string,
    value: number,
}

const createUserSchema = yup.object().shape({
    clientId: yup.string().required('Cliente é obrigatório!'),
})


export default function ProductList({ purchases }: ProductListProps) {
    const api = createApi()

    const { register, handleSubmit, formState, reset } = useForm<FormClientPurchases>({
        resolver: yupResolver(createUserSchema)
    })

    const { register: registerItemToPurchase, control, setValue: setItemToPurchase, watch: watchItemToPurchase, reset: resetItemToPurchase } = useForm<FormItemsPurchases>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const { errors } = formState;

    const [allpurchases, setAllpurchases] = useState<Purchases[]>(purchases)
    const [purchaseselected, setpurchaseselected] = useState<Purchases>()

    const [allProducts, setAllProducts] = useState<Product[]>([])
    const [clientOptions, setClientsOptions] = useState<Option[]>([])
    const [itemsOptions, setItemsOptions] = useState<Option[]>([])

    const [action, setAction] = useState<'C' | 'E'>('C')

    const [modalVisible, setModalVisible] = useState(false)

    useEffect(() => {
        append({} as itemsPurchases)
        getClients()
        getProducts()
    }, [])

    async function submit({ clientId }: FormClientPurchases) {
        debugger
        const tempItems = watchItemToPurchase('items') ?? []

        const formattedItems: itemsPurchases[] = tempItems.map(({
            productId,
            qntd,
        }) => {
            return {
                productId: Number(productId),
                qntd: Number(qntd)
            }
        })

        switch (action) {
            case "C":
                createPurchases(Number(clientId), formattedItems).then(() => {
                    setModalVisible(false)
                    reset()
                })
                break;

            case "E":
                await editProduct({ clientId }).then(() => {
                    setModalVisible(false)
                    setpurchaseselected(undefined)
                    reset()
                })
                break;
        }
    }

    async function createPurchases(clientId: number, itemsPurchases: itemsPurchases[]) {
        try {
            debugger
            let totalValue = 0;

            itemsPurchases.map(({ productId, qntd }) => {
                totalValue += allProducts.find(({ id }) => productId === id).value * qntd
            })

            console.log(
                clientId,
                itemsPurchases,
                totalValue
            )
            const { data } = await api.post<Purchases>('/purchases', {
                clientId,
                itemsPurchases,
                totalValue
            })

            setAllpurchases((prevState) => [...prevState, data]);

            toast.success("Produto cadastrado com sucesso!");
        } catch (error) {
            console.log(error)
        }
    }

    async function editProduct({ clientId }: FormClientPurchases) {
        try {
            const { data } = await api.put<Purchases>(`/product?id=${purchaseselected.id}`, {
            })

            const temppurchases = [...allpurchases]

            temppurchases.find((el) => el.id === data.id).ItemPurchase = data.ItemPurchase;
            temppurchases.find((el) => el.id === data.id).value = data.value;

            setAllpurchases(temppurchases)

            toast.success("Produto editado com sucesso!");
        } catch (error) {
            console.log(error)
        }
    }

    async function deleteProduct(id: number) {
        try {
            api.delete(`/product?id=${id}`).then(() => {
                const filteredAllpurchases = allpurchases.filter((product) => product.id !== id);
                setAllpurchases(filteredAllpurchases)
                toast.success("Produto deletado com sucesso!");
            })
        } catch (error) {
            console.log(error)
        }
    }

    async function getProductById(id: number) {
        try {
            const { data } = await api.get<Product>(`/product/byId?id=${id}`)
        } catch (error) {
            throw new Error()
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
            setItemsOptions(tempOptions)
        } catch (error) {
            console.log(error)
        }
    }
    async function handleOpenEditModal(id: number) {
        reset()
        getProductById(id).then(() => {
            setModalVisible(true)
            setAction('E')
        })
    }

    function handleOpenCadModal() {
        reset()
        setAction('C')
        setModalVisible(true)
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

                        <Button
                            as="a"
                            size="sm"
                            colorScheme="pink"
                            leftIcon={<Icon as={RiAddLine} />}
                            onClick={() => handleOpenCadModal()}
                        >
                            Cadastrar nova
                        </Button>
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
                                                                        product.value
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
                                                            <IconButton
                                                                colorScheme='yellow'
                                                                aria-label='Search database'
                                                                onClick={() => handleOpenEditModal(product.id)}
                                                                icon={<RiEdit2Line />}
                                                                fontSize='20px'
                                                            />
                                                            <IconButton
                                                                colorScheme='red'
                                                                aria-label='Search database'
                                                                icon={<RiDeleteBin6Line />}
                                                                fontSize='20px'
                                                                onClick={() => deleteProduct(product.id)}
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

            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
                <ModalOverlay />
                <ModalContent alignItems="center" justifyContent="center" bg="gray.800">
                    <ModalBody w={800} bg="gray.800" borderRadius={8}>

                        <Box as="form" w="100%" onSubmit={handleSubmit(submit)} flex="1" borderRadius={8} bg="gray.800" p="8" >
                            <Heading size="lg" fontWeight="normal">
                                {
                                    action === "E" ?
                                        `Editar venda`
                                        :
                                        "Cadastrar nova venda"
                                }
                            </Heading>

                            <Divider my="6" borderColor="gray.700" />

                            <VStack spacing="8">
                                <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
                                    <Flex
                                        flexDirection="column"
                                    >
                                        <FormLabel htmlFor={"name"}>Cliente</FormLabel>
                                        <Select
                                            {...register('clientId', { required: true })}
                                            name={"name"}
                                            id={"name"}
                                            focusBorderColor='pink.500'
                                            bgColor="gray.900"
                                            variant={'filled'}
                                            _hover={{
                                                bgColor: 'gray.900'
                                            }}
                                            size="lg"
                                            defaultValue={action === "E" && purchaseselected?.clientId ? purchaseselected.clientId : undefined}
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
                                            !!errors.clientId &&
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
                                            onClick={() => append({} as itemsPurchases)}
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
                                    h={380}
                                    overflowY={"auto"}
                                    display="flex"
                                    flexDir="column"
                                    gap={12}
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
                                                        defaultValue={action === "E" && purchaseselected?.clientId ? purchaseselected.clientId : undefined}
                                                    >
                                                        {
                                                            itemsOptions.map(({ label, value }) =>
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

                            <Flex mt="12" justify="flex-end">
                                <HStack spacing="4">
                                    <Button colorScheme="gray" onClick={() => setModalVisible(false)}> Cancelar</Button>
                                    <Button type="submit" colorScheme="pink"> Salvar</Button>
                                </HStack>
                            </Flex>
                        </Box>

                    </ModalBody>
                </ModalContent>
            </Modal >
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