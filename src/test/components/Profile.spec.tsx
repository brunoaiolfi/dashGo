import { render, screen } from "@testing-library/react"
import { User } from "../../types/user"
import { HeaderProfile } from "../../components/Header/Profile"

describe('Profile component', () => {
    it('Renders user name correctly', () => {
        const user: User = {
            email: 'test@email.test',
            id: 1,
            name: 'test user',
            password: '',
            avatarUrl: 'test.url'
        }
        render(
            <HeaderProfile user={user} />
        )
        expect(
            screen.getByText(user.name)
        ).toBeInTheDocument()
    })

    it('Renders user email correctly', () => {
        const user: User = {
            email: 'test@email.test',
            id: 1,
            name: 'test user',
            password: '',
            avatarUrl: 'test.url'
        }
        render(
            <HeaderProfile user={user} />
        )
        expect(
            screen.getByText(user.email)
        ).toBeInTheDocument()
    })

    it('Renders "Nome não identificado!" when user is undefined', () => {
        render(
            <HeaderProfile user={undefined} />
        )

        expect(
            screen.getByText('Nome não identificado!')
        ).toBeInTheDocument()
    })

    it('Renders "Email não identificado!" when user is undefined', () => {
        render(
            <HeaderProfile user={undefined} />
        )

        expect(
            screen.getByText('Email não identificado!')
        ).toBeInTheDocument()
    })
})