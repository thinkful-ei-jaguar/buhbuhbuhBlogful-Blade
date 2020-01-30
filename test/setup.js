//this is the first file executed when you run tests

require('dotenv').config()
const { expect } = require('chai');
const supertest = require('supertest');

global.expect = expect;
global.supertest = supertest;