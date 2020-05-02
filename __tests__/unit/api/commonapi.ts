import login_handler from '@pages/api/login';
import join_handler from '@pages/api/join';
import logout_handler from '@pages/api/logout';

import { prepareJSONbody, createHTTPMocks } from '../../common'

export const user_creds = {
    username: 'admin',
    email: 'admin@test.com',
    password: 'Pa$$w0rd!',
  }

export async function join_user(user = user_creds) {
    const { req, res } = createHTTPMocks(prepareJSONbody('POST', user)
        );
    await join_handler(req, res);
    return {req, res}
}

export async function login_user(user = {name: user_creds.username, password: user_creds.password}) {
    const { req, res } = createHTTPMocks(prepareJSONbody('POST', user)
    );
    await login_handler(req, res);
    return {req, res}
}

export async function logout_user(token) {
    let { req, res } = createHTTPMocks(prepareJSONbody('POST', {}, {headers:{Authorization: `Bearer ${token}`}}));
    await logout_handler(req, res);
    return {req, res}
}

export async function join_user_and_login(user = user_creds) {
    await join_user()
    return (await login_user()).res._getJSONData().token
}