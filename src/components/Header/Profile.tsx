import { Avatar, Box, Button, Divider, Flex, Heading, HStack, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { ImExit, ImCancelCircle } from "react-icons/im";
import { InputComponent } from "../Form/Input";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { api, createApi } from "../../services/api";
import { toast } from "react-toastify";

interface ProfileProps {
    showProfileData: boolean;
}

interface FormEditUser {
    name: string;
    email: string;
    avatarUrl: string;
    password?: string;
    passwordConfirmation?: string;
}

const createUserSchema = yup.object().shape({
    name: yup.string().required('Nome é obrigatório!'),
    email: yup.string().email('E-mail inválido!').required('E-mail é obrigatório!'),
    password: yup.string().min(6, 'Senha deve ter no mínimo 6 caracteres!'),
    passwordConfirmation: yup.string().oneOf([yup.ref('password'), null], 'Senhas não conferem!'),
})




export function HeaderProfile({ showProfileData }: ProfileProps) {

    const api = createApi()

    const { user, singOut } = useAuth()

    const { isOpen, onOpen, onClose } = useDisclosure()

    const { register, handleSubmit, formState } = useForm<FormEditUser>({
        resolver: yupResolver(createUserSchema)
    })

    const { errors } = formState;

    const [isPasswordInputVisible, setIsPasswordInputVisible] = useState(false)

    async function editPassword({ avatarUrl, email, name, password, passwordConfirmation }: FormEditUser) {
        try {
            await api.put(`/user?id=${user.id}`, {
                email, avatarUrl, name
            })

            if (password && password === passwordConfirmation) {
                await api.patch(`/user/editPassword?id=${user.id}`, {
                    password
                })
            }

            toast.success("Usuário editado com sucesso!")
        } catch (error) {
            console.log(error)
        }
    }

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
                name={user?.name ?? "User avatar"}
                src={user?.avatarUrl}
            />

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent alignItems="center" justifyContent="center" bg="none">
                    <ModalBody w={800} borderRadius={8}>

                        <Box
                            as="form"
                            onSubmit={handleSubmit(editPassword)}
                            w={800}
                            flex="1"
                            borderRadius={8}
                            bg="gray.800"
                            p="16"
                        >
                            <Heading size="lg" fontWeight="normal">
                                Editar usuário
                            </Heading>

                            <Divider my="6" borderColor="gray.700" />

                            <VStack spacing="8">
                                <SimpleGrid minChildWidth="240px" spacing="8" w="100%">

                                    <InputComponent
                                        name="name"
                                        label="Nome Completo"
                                        defaultValue={user?.name}
                                        {...register('name', { required: true })}
                                        errors={errors.name}
                                    />

                                    <InputComponent
                                        name="email"
                                        label="E-mail"
                                        type="email"
                                        defaultValue={user?.email}
                                        {...register('email', { required: true })}
                                        errors={errors.email}
                                    />

                                </SimpleGrid>



                                <SimpleGrid minChildWidth="240px" spacing="8" w="100%">

                                    <InputComponent
                                        name="avatarUrl"
                                        label="Link do seu avatar"
                                        defaultValue={user?.avatarUrl ?? ''}
                                        {...register('avatarUrl')}
                                    />

                                </SimpleGrid>

                                {
                                    isPasswordInputVisible &&
                                    <SimpleGrid minChildWidth="240px" spacing="8" w="100%">

                                        <InputComponent
                                            name="password"
                                            label="Senha"
                                            type="password"
                                            {...register('password', { required: true })}
                                            errors={errors.password}
                                        />
                                        <InputComponent
                                            name="passwordConfirmation"
                                            label="Confirme sua senha"
                                            type="password"
                                            {...register("passwordConfirmation")}
                                            errors={errors.passwordConfirmation}
                                        />

                                    </SimpleGrid>
                                }
                            </VStack>

                            <Flex mt="16" justify="center">

                                <VStack spacing="6" w="100%" >

                                    <VStack spacing="3" w="100%" >
                                        <Button w={400} type="submit" colorScheme="pink">Editar</Button>
                                        <Button
                                            variant="link"
                                            onClick={() => setIsPasswordInputVisible(true)}
                                        >
                                            Editar Senha?
                                        </Button>
                                    </VStack>

                                    <HStack
                                        w={400}
                                        spacing="6"
                                    >
                                        <Divider borderColor="gray.700" />
                                        <Text
                                            color="gray.400"
                                        >
                                            or
                                        </Text>
                                        <Divider borderColor="gray.700" />

                                    </HStack>

                                    <Button
                                        w={400}
                                        p="6"
                                        colorScheme='red'
                                        aria-label='Search database'
                                        leftIcon={<ImExit />}
                                        onClick={singOut}
                                    >
                                        Desconectar
                                    </Button>
                                </VStack>
                            </Flex>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Flex >
    )
}