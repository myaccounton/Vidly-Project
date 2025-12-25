const request = require('supertest');
const { User } = require('../../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = require('../../app');
let server;

describe('/api/auth', () => {

    beforeAll(async () => {
        server = app.listen();
    });

    beforeEach(() => { server = require('../../index'); });
    afterEach(async () => {
        await User.deleteMany({});
        await server.close();
        delete require.cache[require.resolve('../../index')];
    });

    afterAll(async () => {
        await server.close();
        await mongoose.connection.close();
    });

    let email;
    let password;

    const exec = () => {
        return request(server)
            .post('/api/auth')
            .send({ email, password });
    };

    beforeEach(() => {
        email = 'test@example.com';
        password = '12345';
    });

    it('should return 400 if email is missing', async () => {
        email = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 400 if password is missing', async () => {
        password = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 400 if user does not exist', async () => {
        const res = await exec();
        expect(res.status).toBe(400);
        expect(res.text).toMatch(/Invalid email or password/);
    });

    it('should return 400 if password is incorrect', async () => {
        const user = new User({ 
            name: 'tester', 
            email, 
            password: await bcrypt.hash('correctpass', 10) 
        });
        await user.save();

        password = 'wrongpass';
        const res = await exec();

        expect(res.status).toBe(400);
        expect(res.text).toMatch(/Invalid email or password/);
    });

    it('should return a token if input is valid', async () => {
        const user = new User({ 
            name: 'tester', 
            email, 
            password: await bcrypt.hash(password, 10) 
        });
        await user.save();

        const res = await exec();

        expect(res.status).toBe(200);
        expect(res.text).toBeDefined(); // JWT token
    });

});
