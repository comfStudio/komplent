import React, { memo } from 'react'
import MainLayout, { Container } from '@components/App/MainLayout'
import LoginForm from '@components/Form/LoginForm'

const LoginPage = memo(function LoginPage() {
    return (
        <MainLayout noSidebar activeKey="login">
            <Container padded={16}>
                <LoginForm panel />
            </Container>
        </MainLayout>
    )
})

export default LoginPage
