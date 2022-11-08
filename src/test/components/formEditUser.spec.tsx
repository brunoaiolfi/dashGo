import { render, screen, fireEvent } from '@testing-library/react'
import { User } from '../../types/user';
import { FormEditUser } from '../../components/Header/FormEditUser';

describe('Form edit user component', () => {
    it("Set default values with user's data", () => {
        const user: User = {
            email: 'test@email.test',
            id: 1,
            name: 'userTest',
            password: '',
            avatarUrl: 'test.url'
        }

        render(
            <FormEditUser user={user} close={() => { }} />
        )

        expect(
            screen.getByTestId('edit-user-form')
        ).toHaveFormValues({
            email: user.email,
            name: user.name,
            avatarUrl: user.avatarUrl
        })
    }),

        it("Showes password's inputs when click on 'Editar senha'", () => {
            render(
                <FormEditUser user={{} as User} close={() => { }} />
            )

            const showPasswordInputsButton = screen.getByText('Editar Senha?');
            fireEvent.click(showPasswordInputsButton)

            expect(
                screen.getByText('Senha')
            ).toBeInTheDocument()
        })
})