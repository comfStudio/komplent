import misc_handler from '@pages/api/misc';

import { prepareJSONbody, setupServices, createHTTPMocks, stopServices } from '../../common'
import { join_user_and_login } from './commonapi';
import * as user_services from '@services/user';

let services

beforeAll(async () => {
  services = await setupServices()
});

describe('Misc API', () => {

  describe('User has password', () => {

    it('should be so user has a password if joined with credentials', async () => {
      const token = await join_user_and_login()
      const { req, res } = createHTTPMocks(prepareJSONbody('POST', {has_password: true}, {token: token})
        );
      await misc_handler(req, res);
      expect(res._getStatusCode()).toBe(200);
      expect(res._getJSONData()).toEqual({data: { has_password:true }});
    });

    it('send activation email if requested manually', async () => {
      const send_activate_email = jest.spyOn(user_services, "send_activate_email")
      const token = await join_user_and_login()
      const { req, res } = createHTTPMocks(prepareJSONbody('POST', {send_confirmation_email: true}, {token: token})
        );
      await misc_handler(req, res);
      expect(res._getStatusCode()).toBe(200);
      expect(res._getJSONData()).toEqual({data: { send_confirmation_email:true }});
      expect(send_activate_email).toBeCalledTimes(1);

    });
  })

 })

afterAll(async () => {
  stopServices(services)
});