const express = require('express')
const {v4: uuidv4} = require('uuid')
const app = express()

app.use(express.json())

const customers = []
/**
 * cpf = string
 * name = string
 * id = uuid
 * statement = []
 */
app.post('/account', (request, response) => {
    const {cpf, name} = request.body
    const id = uuidv4()
    const customerAlreadyExists = customers.some(
        (customer) => customer.cpf === cpf
    )
    customers.push({
        cpf, name, id, statement: []
    })
    if (customerAlreadyExists) {
        return response.status(400).json({error: "Customer already exists!"})
    }
    return response.json(customers)
})


app.get('/courses', (request, response) => {
    const query = request.query
    console.log(query)
    return response.json(['Course 1', 'Course 2', 'Course 3'])
})
app.post('/courses', (request, response) => {
    const body = request.body
    console.log(body)
    return response.json(['Course 1', 'Course 2', 'Course 3', 'Course 4'])
})
app.put('/courses/:id', (request, response) => {
    const {id} = request.params

    console.log(id)
    return response.json(['Course 5', 'Course 6', 'Course 7', 'Course 8'])
})
app.patch('/courses/:id', (request, response) => {
    return response.json(['Course 1', 'Course 2', 'Course 3', 'Course 4'])
})
app.delete('/courses/:id', (request, response) => {
    return response.json(['Course 1', 'Course 2', 'Course 3', 'Course 4'])
})

app.listen(3333)
