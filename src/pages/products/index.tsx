import { Avatar, Input, Box, Button, ButtonGroup, Divider, Flex, Heading, HStack, Icon, IconButton, Modal, ModalBody, ModalContent, ModalOverlay, SimpleGrid, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { GetServerSideProps } from "next";
import * as yup from 'yup';
import { parseCookies } from "nookies";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { RiAddLine, RiEdit2Line, RiDeleteBin6Line, RiSearch2Line } from "react-icons/ri";
import { InputComponent } from "../../components/Form/Input";
import { Header } from "../../components/Header";
import { SideBar } from "../../components/Sidebar";
import { api, createApi } from "../../services/api";
import { toast } from "react-toastify";
import { Product } from "../../types/product";

interface ProductListProps {
    products: Product[]
}

interface FormProduct {
    name: string
    value: number
}

const createUserSchema = yup.object().shape({
    name: yup.string().required('Produto é obrigatório!'),
    value: yup.string().required('Valor é obrigatório!'),
})


export default function ProductList({ products }: ProductListProps) {
    const api = createApi()

    const { register, handleSubmit, formState, reset } = useForm<FormProduct>({
        resolver: yupResolver(createUserSchema)
    })

    const { errors } = formState;

    const [allProducts, setAllProducts] = useState<Product[]>(products)
    const [modalVisible, setModalVisible] = useState(false)
    const [productSelected, setProductSelected] = useState<Product>()
    const [action, setAction] = useState<'C' | 'E'>('C')

    async function submit({ name, value }: FormProduct) {
        switch (action) {
            case "C":
                createProduct({ name, value }).then(() => {
                    setModalVisible(false)
                    reset()
                })
                break;

            case "E":
                await editProduct({ name, value }).then(() => {
                    setModalVisible(false)
                    setProductSelected(undefined)
                    reset()
                })
                break;
        }

    }

    async function createProduct({ name, value }: FormProduct) {
        try {
            const { data } = await api.post<Product>('/product', {
                name,
                value: Number(value)
            })

            setAllProducts((prevState) => [...prevState, data]);

            toast.success("Produto cadastrado com sucesso!");
        } catch (error) {
            console.log(error)
        }
    }

    async function editProduct({ name, value }: FormProduct) {
        try {
            const { data } = await api.put<Product>(`/product?id=${productSelected.id}`, {
                name,
                value: Number(value)
            })

            const tempProducts = [...allProducts]

            tempProducts.find((el) => el.id === data.id).name = data.name;
            tempProducts.find((el) => el.id === data.id).value = data.value;

            setAllProducts(tempProducts)

            toast.success("Produto editado com sucesso!");
        } catch (error) {
            console.log(error)
        }
    }

    async function deleteProduct(id: number) {
        try {
            api.delete(`/product?id=${id}`).then(() => {
                const filteredAllProducts = allProducts.filter((product) => product.id !== id);
                setAllProducts(filteredAllProducts)
                toast.success("Produto deletado com sucesso!");
            })
        } catch (error) {
            console.log(error)
        }
    }

    async function getProductById(id: number) {
        try {
            const { data } = await api.get<Product>(`/product/byId?id=${id}`)
            setProductSelected(data)
        } catch (error) {
            throw new Error()
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
                            Produtos
                        </Heading>

                        <Button
                            as="a"
                            size="sm"
                            colorScheme="pink"
                            leftIcon={<Icon as={RiAddLine} />}
                            onClick={() => handleOpenCadModal()}
                        >
                            Criar novo
                        </Button>
                    </Flex>

                    {
                        !allProducts.length ?
                            <Text color="gray.300">
                                Nenhum produto encontrado
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
                                                Produto
                                            </Th>
                                            <Th>
                                                Preço
                                            </Th>
                                            <Th>
                                                Ações
                                            </Th>
                                        </Tr>
                                    </Thead>

                                    <Tbody>

                                        {
                                            allProducts.map(product => (
                                                <Tr key={product.id}>
                                                    <Td>
                                                        <Box>
                                                            <Text
                                                                color="white"
                                                            >
                                                                {product.name}
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
                                        `Editar produto`
                                        :
                                        "Cadastrar novo produto"
                                }
                            </Heading>

                            <Divider my="6" borderColor="gray.700" />

                            <VStack spacing="8">
                                <SimpleGrid minChildWidth="240px" spacing="8" w="100%">

                                    <InputComponent
                                        name="name"
                                        label="Produto"
                                        {...register('name', { required: true })}
                                        errors={errors.name}
                                        defaultValue={action === "E" && productSelected?.name ? productSelected.name : undefined}
                                    />

                                    <InputComponent
                                        name="value"
                                        label="Preço R$"
                                        type="number"
                                        step="0.1"
                                        {...register('value', { required: true })}
                                        errors={errors.value}
                                        defaultValue={action === "E" && productSelected?.value ? productSelected.value : 0}
                                    />

                                </SimpleGrid>
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

    const products: Product[] = []

    try {
        const { data } = await api.get<Product[]>('/product/all')

        data.sort((a, b) => a.name > b.name ? 1 : -1)
        products.push(...data)

    } catch (error: any) {
        console.log(error)
    }

    return {
        props: {
            products
        }
    }
}