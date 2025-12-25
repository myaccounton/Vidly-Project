const request = require('supertest');
const { Genre } = require('../../models/genre');
const mongoose = require('mongoose');
let server;

describe('/api/genres', () => {

    beforeEach(async () => { 
        server = require('../../index');
    });
    
    afterEach(async () => {
        await Genre.deleteMany({});
        await server.close();
        delete require.cache[require.resolve('../../index')];
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            // Clean first to ensure fresh state
            await Genre.deleteMany({});
            
            // Use the Genre model, not collection.insertMany
            await Genre.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ]);

            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return a genre if valid id is passed', async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            const res = await request(server).get('/api/genres/' + genre._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/genres/1');
            expect(res.status).toBe(404);
        });

        it('should return 404 if no genre with the given id exists', async () => {
            const id = new mongoose.Types.ObjectId();
            const res = await request(server).get('/api/genres/' + id);
            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {
        let token;
        beforeEach(() => {
            const { User } = require('../../models/user');
            const user = new User();
            token = user.generateAuthToken();
        });

        const exec = (name) => {
            return request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name });
        };

        it('should return 401 if client is not logged in', async () => {
            token = '';
            const res = await exec('genre1');
            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 5 characters', async () => {
            const res = await exec('1234');
            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 characters', async () => {
            const name = new Array(52).join('a');
            const res = await exec(name);
            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid', async () => {
            const res = await exec('Valid Genre');
            const genre = await Genre.find({ name: 'Valid Genre' });
            expect(genre).not.toBeNull();
        });

        it('should return the genre if it is valid', async () => {
            const res = await exec('Valid Genre');
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'Valid Genre');
        });
    });

});