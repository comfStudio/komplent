import login_handler from '@pages/api/login';
import join_handler from '@pages/api/join';
import logout_handler from '@pages/api/logout';

import { prepareJSONbody, setupServices, createHTTPMocks, stopServices } from '../../common'
import * as user_services from '@services/user';
import fairy from '@server/fairy';

let services

beforeAll(async () => {
  services = await setupServices()
});

const user_creds = {
  username: 'admin',
  email: 'admin@test.com',
  password: 'Pa$$w0rd!',
}

describe('Auth API', () => {

  describe('Join API', () => {

    it('should join with credentials and user joined event was called and activation mail sent', async () => {
      const event_fn = jest.fn(user => null)
      fairy()?.on("user_joined", event_fn)
      const { req, res } = createHTTPMocks(prepareJSONbody('POST', user_creds)
        );
      await join_handler(req, res);
      expect(res._getStatusCode()).toBe(200);
      expect(res._getJSONData()).toEqual({msg:"Joined"});
      await new Promise((r) => setTimeout(r, 1000));
      expect(event_fn).toBeCalled();
      fairy()?.removeListener("user_joined", event_fn)
    });

    it.each([
      {username: user_creds.username},
      {email: user_creds.email},
      {password: user_creds.password},
      {...user_creds, password: undefined},
      {...user_creds, username: undefined},
      {...user_creds, email: undefined},
    ])("should not join only with '%p'", async (args) => {
      const { req, res } = createHTTPMocks(prepareJSONbody('POST', args)
        );
      await join_handler(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toEqual({error:"Missing user credentials"});
    });

    it('should not join if already exists', async () => {
      const { req, res } = createHTTPMocks(prepareJSONbody('POST', user_creds)
        );
      await join_handler(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toEqual({error:"User already exists"});
    });

  })

  describe('Login API', () => {

    it('should login with name credentials', async () => {
      const { req, res } = createHTTPMocks(prepareJSONbody('POST', {name: user_creds.username, password: user_creds.password})
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
      const { req, res } = createHTTPMocks(prepareJSONbody('POST', args)
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
      const { req, res } = createHTTPMocks(prepareJSONbody('POST', args)
        );
      await login_handler(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toEqual({error:"User does not exists"});
    });
    
    it("can't register if logged in", async () => {
      const { req:login_req, res:login_res } = createHTTPMocks(prepareJSONbody('POST', {name: user_creds.username, password: user_creds.password})
        );
      await login_handler(login_req, login_res);
      expect(login_res._getStatusCode()).toBe(200);
      let { req, res } = createHTTPMocks(prepareJSONbody('POST', user_creds, {headers:{Authorization: `Bearer ${login_res._getJSONData().token}`}}));
      await join_handler(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toEqual({error:"Already logged in"});
    });

    it("can't login if logged in", async () => {
      const { req:login_req, res:login_res } = createHTTPMocks(prepareJSONbody('POST', {name: user_creds.username, password: user_creds.password})
        );
      await login_handler(login_req, login_res);
      expect(login_res._getStatusCode()).toBe(200);
      let { req, res } = createHTTPMocks(prepareJSONbody('POST', {name: user_creds.username, password: user_creds.password}, {headers:{Authorization: `Bearer ${login_res._getJSONData().token}`}}));
      await join_handler(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toEqual({error:"Already logged in"});
    });
  
   })

   describe('Logout API', () => {

    
    it("can logout if logged in", async () => {
      const { req:login_req, res:login_res } = createHTTPMocks(prepareJSONbody('POST', {name: user_creds.username, password: user_creds.password})
        );
      await login_handler(login_req, login_res);
      expect(login_res._getStatusCode()).toBe(200);
      let { req, res } = createHTTPMocks(prepareJSONbody('POST', {}, {headers:{Authorization: `Bearer ${login_res._getJSONData().token}`}}));
      await logout_handler(req, res);
      expect(res._getStatusCode()).toBe(200);
      expect(res._getJSONData()).toEqual({msg:"Logged out"});
    });

    it("cannot logout if no active users", async () => {
      let { req, res } = createHTTPMocks(prepareJSONbody('POST', {}));
      await logout_handler(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toEqual({error:"No active user"});
    });

    it("should have no active users after logout/token is invalidated", async () => {
      const { req:login_req, res:login_res } = createHTTPMocks(prepareJSONbody('POST', {name: user_creds.username, password: user_creds.password})
        );
      await login_handler(login_req, login_res);
      expect(login_res._getStatusCode()).toBe(200);
      let { req, res } = createHTTPMocks(prepareJSONbody('POST', {}, {headers:{Authorization: `Bearer ${login_res._getJSONData().token}`}}));
      await logout_handler(req, res);
      expect(res._getStatusCode()).toBe(200);
      expect(res._getJSONData()).toEqual({msg:"Logged out"});
      
      let { req: req2, res: res2 } = createHTTPMocks(prepareJSONbody('POST', {}, {headers:{Authorization: `Bearer ${login_res._getJSONData().token}`}}));
      await logout_handler(req2, res2);
      expect(res2._getStatusCode()).toBe(400);
      expect(res2._getJSONData()).toEqual({error:"No active user"});
    });

   })

 })

 afterAll(async () => {
  stopServices(services)
});