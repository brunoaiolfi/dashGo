import { render } from '@testing-library/react'
import { ActiveLink } from '../../components/ActiveLink'


jest.mock("next/router", () => {
    return {
        useRouter() {
            return {
                asPath: '/'
            }
        }
    }
})

describe('ActiveLink component', () => {

    it('receiving color pink when active', () => {
        const { getByText } = render(
            <ActiveLink href="/">
                <h1>
                    Home
                </h1>
            </ActiveLink>
        )

        expect(
            getByText('Home')
        ).toHaveStyle('color: pink.400')
    })
})
