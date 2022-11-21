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
import { Client, formatedClient } from "../../types/client";
import { toast } from "react-toastify";

interface ClientsListProps {
    clients: formatedClient[]
}

interface FormCreateClient {
    name: string
}

const createUserSchema = yup.object().shape({
    name: yup.string().required('Nome é obrigatório!'),
})


export default function ClientsList({ clients }: ClientsListProps) {
    const api = createApi()

    const { register, handleSubmit, formState, reset } = useForm<FormCreateClient>({
        resolver: yupResolver(createUserSchema)
    })

    const { errors } = formState;

    const [allClients, setAllClients] = useState<formatedClient[]>(clients)
    const [modalVisible, setModalVisible] = useState(false)
    const [clientSelected, setClientSelected] = useState<Client>()
    const [action, setAction] = useState<'C' | 'E'>('C')

    async function submit({ name }: FormCreateClient) {
        switch (action) {
            case "C":
                createClient({ name }).then(() => {
                    setModalVisible(false)
                    reset()
                })
                break;

            case "E":
                await editClient({ name }).then(() => {
                    setModalVisible(false)
                    setClientSelected(undefined)
                    reset()
                })
                break;
        }

    }

    async function createClient({ name }: FormCreateClient) {
        try {
            const { data } = await api.post('/client', {
                name
            })

            const formattedNewClient: formatedClient = {
                id: data.id,
                name: data.name,
                dtCreated: new Date(data.dtCreated).toLocaleDateString('en-GB')
            }

            setAllClients((prevState) => [...prevState, formattedNewClient]);

            toast.success("Cliente cadastrado com sucesso!");
        } catch (error) {
            console.log(error)
        }
    }

    async function editClient({ name }: FormCreateClient) {
        try {
            const { data } = await api.put(`/client?id=${clientSelected.id}`, {
                name
            })

            const tempClients = [...allClients]

            tempClients.find((el) => el.id === data.id).name = data.name;

            setAllClients(tempClients)


            toast.success("Cliente editado com sucesso!");
        } catch (error) {
            console.log(error)
        }
    }

    async function deleteClient(id: number) {
        try {
            api.delete(`/client?id=${id}`).then(() => {
                const filteredAllClients = allClients.filter((client) => client.id !== id);
                setAllClients(filteredAllClients)
                toast.success("Cliente deletado com sucesso!");
            })
        } catch (error) {
            console.log(error)
        }
    }

    async function getClientById(id: number) {
        try {
            const { data } = await api.get<Client>(`/client/byId?id=${id}`)
            setClientSelected(data)
        } catch (error) {
            throw new Error()
        }
    }

    async function handleOpenEditModal(id: number) {
        reset()
        getClientById(id).then(() => {
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
                            Clientes
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
                        !allClients.length ?
                            <Text color="gray.300">
                                Nenhum cliente encontrado
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
                                                Data de cadastro
                                            </Th>
                                            <Th>
                                                Ações
                                            </Th>
                                        </Tr>
                                    </Thead>

                                    <Tbody>

                                        {
                                            allClients.map(client => (
                                                <Tr key={client.id}>
                                                    <Td>
                                                        <Box>
                                                            <Text
                                                                color="white"
                                                            >
                                                                {client.name}
                                                            </Text>
                                                        </Box>
                                                    </Td>
                                                    <Td>
                                                        <Box>
                                                            <Text
                                                                fontSize="sm"
                                                                color="white"
                                                            >
                                                                {client.dtCreated}
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
                                                                onClick={() => handleOpenEditModal(client.id)}
                                                                icon={<RiEdit2Line />}
                                                                fontSize='20px'
                                                            />
                                                            <IconButton
                                                                colorScheme='red'
                                                                aria-label='Search database'
                                                                icon={<RiDeleteBin6Line />}
                                                                fontSize='20px'
                                                                onClick={() => deleteClient(client.id)}
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
                                        `Editar cliente`
                                        :
                                        "Cadastrar novo cliente"
                                }
                            </Heading>

                            <Divider my="6" borderColor="gray.700" />

                            <VStack spacing="8">
                                <SimpleGrid minChildWidth="240px" spacing="8" w="100%">

                                    <InputComponent
                                        name="name"
                                        label="Nome Completo"
                                        {...register('name', { required: true })}
                                        errors={errors.name}
                                        defaultValue={action === "E" && clientSelected?.name ? clientSelected.name : undefined}
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

    const clients: formatedClient[] = []

    try {
        const { data } = await api.get<Client[]>('/client/all')

        const tempClientsFormatted: formatedClient[] = data.map(({
            dtCreated,
            id,
            name,
        }) => {
            return {
                id,
                name,
                dtCreated: new Date(dtCreated).toLocaleDateString('en-GB')
            }
        })

        tempClientsFormatted.sort((a, b) => a.name > b.name ? 1 : -1)
        clients.push(...tempClientsFormatted)

    } catch (error: any) {
        console.log(error)
    }

    return {
        props: {
            clients
        }
    }
}