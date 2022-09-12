import { Box, Button, Divider, Flex, Heading, HStack, SimpleGrid, VStack } from "@chakra-ui/react";
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { InputComponent } from "../../components/Form/Input";
import { Header } from "../../components/Header";
import { SideBar } from "../../components/Sidebar";
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from "../../services/api";
import { useRouter } from "next/router";

interface FormCreateUserProps {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

const createUserSchema = yup.object().shape({
    name: yup.string().required('Nome é obrigatório!'),
    email: yup.string().email('E-mail inválido!').required('E-mail é obrigatório!'),
    password: yup.string().required('Senha é obrigatória!').min(6, 'Senha deve ter no mínimo 6 caracteres!'),
    password_confirmation: yup.string().oneOf([yup.ref('password'), null], 'Senhas não conferem!'),
})

export default function CreateUser() {

    const router = useRouter()
    const queryClient = useQueryClient()

    const createUser = useMutation(async ({ email, password, name, password_confirmation, }: FormCreateUserProps) => {
        const { data } = await api.post('users', {
            email,
            name,
        })

        return data.user;
    }, {
        onSuccess: () => { queryClient.invalidateQueries(['users']).then(() => { router.push('/users') }) }
    });

    const { register, handleSubmit, formState } = useForm<FormCreateUserProps>({
        resolver: yupResolver(createUserSchema)
    })

    const { errors } = formState;

    async function handleCreateUser({ email, password, name, password_confirmation, }: FormCreateUserProps) {
        await createUser.mutateAsync({ email, password, name, password_confirmation });
    }

    return (
        <Box>
            <Header />

            <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6" >
                <SideBar />

                <Box as="form" onSubmit={handleSubmit(handleCreateUser)} flex="1" borderRadius={8} bg="gray.800" p="8" >
                    <Heading size="lg" fontWeight="normal">
                        Criar usuário
                    </Heading>

                    <Divider my="6" borderColor="gray.700" />

                    <VStack spacing="8">
                        <SimpleGrid minChildWidth="240px" spacing="8" w="100%">

                            <InputComponent
                                name="name"
                                label="Nome Completo"
                                {...register('name', { required: true })}
                                errors={errors.name}
                            />

                            <InputComponent
                                name="email"
                                label="E-mail"
                                type="email"
                                {...register('email', { required: true })}
                                errors={errors.email}
                            />

                        </SimpleGrid>

                        <SimpleGrid minChildWidth="240px" spacing="8" w="100%">

                            <InputComponent
                                name="password"
                                label="Senha"
                                type="password"
                                {...register('password', { required: true })}
                                errors={errors.password}
                            />

                            <InputComponent
                                name="password"
                                label="Confirme sua senha"
                                type="password"
                                {...register('password_confirmation')}
                                errors={errors.password_confirmation}
                            />

                        </SimpleGrid>
                    </VStack>

                    <Flex mt="8" justify="flex-end">
                        <HStack spacing="4">
                            <Link href="/users" passHref>
                                <Button colorScheme="whiteAlpha"> Cancelar</Button>
                            </Link>
                            <Button type="submit" colorScheme="pink"> Salvar</Button>
                        </HStack>
                    </Flex>
                </Box>

            </Flex>
        </Box>
    )
}