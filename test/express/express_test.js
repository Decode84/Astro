/* eslint-disable no-undef */
const express = require('express')
const request = require('supertest')
const assert = require('assert')

const app = express()

app.get('/gettest', function (req, res) {
    res.status(200).json({ message: 'Hello World!' })
})

app.post('/posttest', function (req, res) {
    res.status(200).json(res.body)
})

describe('GET /gettest', () => {
    it('responds with 200 and json', (done) => {
        request(app)
            .get('/gettest')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                assert(response.body.message === 'Hello World!')
                done()
            })
    })
})

describe('POST /posttest', () => {
    it('responds with 200', (done) => {
        request(app)
            .post('/posttest')
            .send({ message: 'Hello World!' })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                assert(response.status === 200)
                done()
            })
    })
})
