// const ioredisMock = require('ioredis-mock')
// jest.setMock('ioredis', ioredisMock)

jest.setMock('redis', require('redis-mock'))

import dotenv from 'dotenv';

dotenv.config({path: './.env_test'});

const Adapter = require('enzyme-adapter-react-16')

require('enzyme').configure({ adapter: new Adapter() })
