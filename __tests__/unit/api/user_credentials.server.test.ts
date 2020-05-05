import creds_handler from '@pages/api/update_user_creds';

import { prepareJSONbody, setupServices, createHTTPMocks, stopServices } from '../../common'
import { join_user_and_login } from './commonapi';
import * as user_services from '@services/user';
import { RESERVED_USERNAMES } from '@server/constants';

const user_creds = {
  username: 'admin_creds',
  email: 'admin_creds@test.com',
  password: 'Pa$$w0rd!',
}

const new_pass = "45645hgfhgfjy5675"

let services
let token

beforeAll(async () => {
  services = await setupServices()
  token = await join_user_and_login(user_creds)
});

describe('User Credentials API', () => {

  describe('User email change', () => {

    it('should be allowed to change the email', async () => {
      const nemail = "newemail@test.com"
      const { req, res } = createHTTPMocks(prepareJSONbody('POST', {data: {email: nemail}}, {token: token})
        );
      await creds_handler(req, res);
      expect(res._getStatusCode()).toBe(200);
      expect(res._getJSONData()).toMatchObject({data: { token: expect.any(String), user: expect.any(Object) }});
      expect(res._getJSONData().data.user.email).toEqual(nemail);
      // eslint-disable-next-line
      token = res._getJSONData().data.token
    });
  })

  describe('User username change', () => {

    it('should be allowed to change the username', async () => {
      const nname = "newname12344sdgf"
      const { req, res } = createHTTPMocks(prepareJSONbody('POST', {data: {username: nname}}, {token: token})
        );
      await creds_handler(req, res);
      expect(res._getStatusCode()).toBe(200);
      expect(res._getJSONData()).toMatchObject({data: { token: expect.any(String), user: expect.any(Object) }});
      expect(res._getJSONData().data.user.username).toEqual(nname);
      // eslint-disable-next-line
      token = res._getJSONData().data.token
    });

    it.each(["1", RESERVED_USERNAMES[0], "22"])("should not be allowed to change to invalid username '%p'", async (nname) => {
      const { req, res } = createHTTPMocks(prepareJSONbody('POST', {data: {username: nname}}, {token: token})
        );
      await creds_handler(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toMatchObject({error: expect.anything()});
    });

  })

  describe('User password change', () => {

    it('should not be allowed to change to password without providing old password', async () => {
      const npass = "123"
      const { req, res } = createHTTPMocks(prepareJSONbody('POST', {data: {password: npass}}, {token: token})
        );
      await creds_handler(req, res);
      console.log(res._getJSONData())
      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toMatchObject({error: expect.any(String)});
      expect(res._getJSONData().error).toContain("match");
    });

    it('should be allowed to change the password', async () => {
      const { req, res } = createHTTPMocks(prepareJSONbody('POST', {data: {password: new_pass, old_password: user_creds.password}}, {token: token})
        );
      await creds_handler(req, res);
      expect(res._getStatusCode()).toBe(200);
      console.log(res._getJSONData())
      expect(res._getJSONData()).toMatchObject({data: { token: expect.any(String), user: expect.any(Object) }});
      expect(res._getJSONData().data.token).not.toEqual(token);
      // eslint-disable-next-line
      token = res._getJSONData().data.token
    });

    it('should not be allowed to change to invalid password', async () => {
      const npass = "123"
      const { req, res } = createHTTPMocks(prepareJSONbody('POST', {data: {password: npass, old_password: new_pass}}, {token: token})
        );
      await creds_handler(req, res);
      console.log(res._getJSONData())
      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toMatchObject({error: expect.anything()});
      expect(res._getJSONData().error).toContain("validation failed");
    });

  })

 })

afterAll(async () => {
  stopServices(services)
});