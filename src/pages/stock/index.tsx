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
import { Stock } from "../../types/stock";

interface StockProps {
    stock: Stock[]
}

interface FormStock {
    qntd: number
}

const createUserSchema = yup.object().shape({
    qntd: yup.string().required('A quantidade do produto é obrigatório!'),
})


export default function StockList({ stock }: StockProps) {

    const api = createApi()

    const { register, handleSubmit, formState, reset } = useForm<FormStock>({
        resolver: yupResolver(createUserSchema)
    })

    const { errors } = formState;

    const [allStocks, setAllStocks] = useState<Stock[]>(stock)
    const [stockSelected, setStockSelected] = useState<Stock>()
    const [modalVisible, setModalVisible] = useState(false)

    async function submit({ qntd }: FormStock) {
        await editStock({ qntd }).then(() => {
            setModalVisible(false)
            setStockSelected(undefined)
            reset()
        })
    }

    async function editStock({ qntd }: FormStock) {
        try {
            const { data } = await api.put<Stock>(`/stock?id=${stockSelected?.id}`, {
                qntd: Number(qntd)
            })

            const tempStocks = [...allStocks]

            tempStocks.find((el) => el.id === data.id).qntd = data.qntd;

            setAllStocks(tempStocks)

            toast.success("Quantidade do produto editado com sucesso!");
        } catch (error) {
            console.log(error)
        }
    }

    async function getStockById(id: number) {
        try {
            const { data } = await api.get<Stock>(`/stock/byId?id=${id}`)
            setStockSelected(data)
        } catch (error) {
            throw new Error()
        }
    }

    async function handleOpenEditModal(id: number) {
        reset()
        getStockById(id).then(() => {
            setModalVisible(true)
        })
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
                            Estoque
                        </Heading>
                    </Flex>

                    {
                        !allStocks.length ?
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
                                                Quantidade
                                            </Th>
                                            <Th>
                                                Ações
                                            </Th>
                                        </Tr>
                                    </Thead>

                                    <Tbody>

                                        {
                                            allStocks.map(stock => (
                                                <Tr key={stock.id}>
                                                    <Td>
                                                        <Box>
                                                            <Text
                                                                color="white"
                                                            >
                                                                {stock?.product?.name}
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
                                                                    stock.qntd
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
                                                                onClick={() => handleOpenEditModal(stock.id)}
                                                                icon={<RiEdit2Line />}
                                                                fontSize='20px'
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
                                Editar estoque do produto
                            </Heading>

                            <Divider my="6" borderColor="gray.700" />

                            <VStack spacing="8">
                                <SimpleGrid minChildWidth="240px" spacing="8" w="100%">

                                    <InputComponent
                                        name="name"
                                        label="Produto"
                                        value={stockSelected?.product?.name}
                                        isDisabled={true}
                                    />

                                    <InputComponent
                                        name="value"
                                        label="Quantidade"
                                        type="number"
                                        step="0.1"
                                        {...register('qntd', { required: true })}
                                        errors={errors.qntd}
                                        defaultValue={stockSelected?.qntd ?? 0}
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

    const stock: Stock[] = []

    try {
        const { data } = await api.get<Stock[]>('/stock/all')
        console.log(data)
        data.sort((a, b) => a?.product.name > b?.product.name ? 1 : -1)
        stock.push(...data)

    } catch (error: any) {
        console.log(error)
    }

    return {
        props: {
            stock
        }
    }
}