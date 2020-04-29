import { createMocks } from 'node-mocks-http';
import login_handler from '@pages/api/login';
import join_handler from '@pages/api/join';

import { prepareJSONbody, setupServices } from '../../common'

beforeAll(async () => {
  await setupServices()
});

const user_creds = {
  username: 'admin',
  email: 'admin@test.com',
  password: 'Pa$$w0rd!',
}

describe('Auth API', () => {

  describe('Join API', () => {

    it('should join with credentials', async () => {
      const { req, res } = createMocks(prepareJSONbody('POST', user_creds)
        );
      await join_handler(req, res);
      expect(res._getStatusCode()).toBe(200);
      expect(res._getJSONData()).toEqual({msg:"Joined"});
    });

    it.each([
      {username: user_creds.username},
      {email: user_creds.email},
      {password: user_creds.password},
      {...user_creds, password: undefined},
      {...user_creds, username: undefined},
      {...user_creds, email: undefined},
    ])("should not join only with '%p'", async (args) => {
      const { req, res } = createMocks(prepareJSONbody('POST', args)
        );
      await join_handler(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toEqual({error:"Missing user credentials"});
    });

    it('should not join if already exists', async () => {
      const { req, res } = createMocks(prepareJSONbody('POST', user_creds)
        );
      await join_handler(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toEqual({error:"User already exists"});
    });

  })

  describe('Login API', () => {

    it('should login with name credentials', async () => {
      const { req, res } = createMocks(prepareJSONbody('POST', {name: user_creds.username, password: user_creds.password})
        );
      await login_handler(req, res);
      expect(res._getStatusCode()).toBe(200);
      expect(res._getJSONData()).toBeDefined();
      expect(res._getJSONData()).toHaveProperty("msg", "Logged in");
      expect(res._getJSONData()).toHaveProperty("user.username", user_creds.username);
      expect(res._getJSONData()).toHaveProperty("user.name", user_creds.username);
      expect(res._getJSONData()).toHaveProperty("user.email", user_creds.email);
      expect(res._getJSONData()).not.toHaveProperty("user.password");
      expect(res._getJSONData()).toMatchObject({msg:"Logged in"});
      expect(res._getJSONData().token).toBeDefined();
    });

    it.each([
      {name: user_creds.username},
      {password: user_creds.password},
      {...user_creds},
    ])("should not login only with '%p'", async (args) => {
      const { req, res } = createMocks(prepareJSONbody('POST', args)
        );
      await login_handler(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toEqual({error:"Missing user credentials"});
    });

    it.each([
      {name: user_creds.username, password: "1234345"},
      {name: "hmmm123", password: user_creds.password},
      {name: "okayyy", password: "5676"},
    ])("should not login with wrong name or password '%p'", async (args) => {
      const { req, res } = createMocks(prepareJSONbody('POST', args)
        );
      await login_handler(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toEqual({error:"User does not exists"});
    });
    
    it("can't register if logged in", async () => {
      const { req:login_req, res:login_res } = createMocks(prepareJSONbody('POST', {name: user_creds.username, password: user_creds.password})
        );
      await login_handler(login_req, login_res);
      expect(login_res._getStatusCode()).toBe(200);
      let { req, res } = createMocks(prepareJSONbody('POST', user_creds, {Authorization: `Bearer ${login_res._getJSONData().token}`}));
      await join_handler(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toEqual({error:"Already logged in"});
    });

    it("can't login if logged in", async () => {
      const { req:login_req, res:login_res } = createMocks(prepareJSONbody('POST', {name: user_creds.username, password: user_creds.password})
        );
      await login_handler(login_req, login_res);
      expect(login_res._getStatusCode()).toBe(200);
      let { req, res } = createMocks(prepareJSONbody('POST', {name: user_creds.username, password: user_creds.password}, {Authorization: `Bearer ${login_res._getJSONData().token}`}));
      await join_handler(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toEqual({error:"Already logged in"});
    });
  
   })

 })
