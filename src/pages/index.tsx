import React, { useContext, useEffect } from 'react';
import { Flex, Input, Button, Stack, FormLabel, FormControl, useFormControl } from '@chakra-ui/react'
import { InputComponent } from '../components/Form/Input';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../contexts/AuthContext';

interface FormLoginProps {
  email: string;
  password: string;
}

const signInFormSchema = yup.object().shape({
  email: yup.string().email('E-mail inválido!').required('E-mail é obrigatório!'),
  password: yup.string().required('Senha é obrigatória!'),
})

export default function Login() {

  const { signIn } = useAuth()

  const { register, handleSubmit, formState } = useForm<FormLoginProps>({
    resolver: yupResolver(signInFormSchema)
  })

  const { errors } = formState;

  function handleSignIn({ email, password }: FormLoginProps) {
    signIn({ email, password })
  }

  return (
    <Flex
      width="100vw"
      height="100vh"
      alignItems='center'
      justifyContent="center"
    >
      <Flex
        as="form"
        width="100%"
        maxWidth="360px"
        background="gray.800"
        padding="8"
        borderRadius={8}
        flexDirection="column"
        onSubmit={handleSubmit(handleSignIn)}
      >
        <Stack spacing="4">

          <InputComponent
            {...register('email', { required: true })}
            type="email"
            name="email"
            label="E-mail"
            errors={errors.email}
          />

          <InputComponent
            {...register('password', { required: true })}
            type="password"
            name="password"
            label="Senha"
            errors={errors.password}
          />

        </Stack>

        <Button
          type="submit"
          marginTop="12"
          size="lg"
          colorScheme="pink"
        >
          Entrar
        </Button>
      </Flex>
    </Flex>
  )
}
