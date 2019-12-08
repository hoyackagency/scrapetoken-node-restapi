const request = require('supertest');
const assert = require('assert');
const app = require('../server/server');
const async = require('async');

// JWT authentication & authorization test
token = "";
badtoken = "";

describe('POST /api/auth/token', () => {
    it('/auth/token should return user information and token for authentication.', (done) => {
        request(app)
        .post('/api/auth/token')
        .send({
            "username": "xuefeng",
            "password": "xxf2010529"
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
            res.body.user_email = "xixuefeng11@hotmail.com";
            res.body.user_nicename = "xuefeng";
            res.body.user_display_name = "XueFeng Xi";
            assert.strictEqual(res.body.token.length > 0, true);

            token = res.body.token;
            badtoken = token + "ss";
        })
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
    });

    it('/auth/token should failed on form data.', (done) => {
        request(app)
        .post('/api/auth/token')
        .field("username", "xuefeng")
        .field("password", "xxf2010529")
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .expect((res) => {
            assert.strictEqual(res.status, 400);
            res.body.message = "username or password is invalid";
        })
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
    });    
});


describe('POST /api/auth/token/validate', () => {
    // var token = null;

    // before(function(done) {
    //   request(app)
    //     .post('/api/auth/token')
    //     .send({
    //         "username": "xuefeng",
    //         "password": "xxf2010529"
    //     })
    //     .set('Accept', 'application/json')
    //     .end(function(err, res) {
    //       token = res.body.token; // Or something
    //       done();
    //     });
    // });

    it('token validation should get a valid token user: xuefeng', (done) => {
        request(app)
        .post('/api/auth/token/validate')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
            res.body.code = "jwt_auth_valid_token";
        })
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
    });

    it('token validation should fail without authorization header', (done) => {
        request(app)
        .post('/api/auth/token/validate')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .expect((res) => {
            assert.strictEqual(res.status, 400);
            res.body.message = "Bad request";
        })
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
    });
    
    it('token validation should fail with malformed token', (done) => {
        request(app)
        .post('/api/auth/token/validate')
        .set('Authorization', 'Bearer ' + badtoken)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(403)
        .expect((res) => {
            assert.strictEqual(res.status, 403);
            res.body.message = "Signature verification failed";
        })
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
    });    
});


// WordPress REST API Test
describe('GET /api/users/me', () => {
    it('/api/users/me test, it needs authentication token', (done) => {
        request(app)
        .get('/api/users/me')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
            assert.strictEqual(res.body.id, 3);
            res.body.email = "xixuefeng11@hotmail.com";
            res.body.username = "xuefeng";
            res.body.name = "XueFeng Xi";
            res.body.roles[0] = "customer";
        })
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
    });

    it('/api/users/me test, no authentication token', (done) => {
        request(app)
        .get('/api/users/me')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .expect(res => {
            assert.strictEqual(res.status, 400);
            res.body.message = "Bad request";
        })
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
    });
});


// WooCommerce REST API Test
describe('GET /api/orders', () => {
    it('/api/orders test, it needs authentication token and customer query parameter', (done) => {
        request(app)
        .get('/api/orders?customer=3')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
            assert.strictEqual(res.body.length, 0);
        })
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
    });

    it('/api/orders test, Exception Case: no authentication token', (done) => {
        request(app)
        .get('/api/orders?customer=3')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .expect(res => {
            assert.strictEqual(res.status, 400);
            res.body.message = "Bad request";
        })
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
    });

    it('/api/orders test, Exception Case: no customer id', (done) => {
        request(app)
        .get('/api/orders')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .expect(res => {
            assert.strictEqual(res.status, 400);
            res.body.message = "Bad request";
        })
        .end(function(err, res) {
            if (err) return done(err);
            assert.strictEqual(res.status, 400);
            res.body.message = "Bad request";
            done();
            console.log("Passed");
        });
    });
            
    it('/api/orders test, Exception Case: invlid customer id', (done) => {
        request(app)
        .get('/api/orders?customer=1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .expect(res => {
            assert.strictEqual(res.status, 400);
            res.body.message = "Bad request";
        })
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
    });
});
