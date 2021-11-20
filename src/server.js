const express = require('express')
const { v4: uuidv4 } = require('uuid')
const app = express()

app.use(express.json())

//middleware
function verifyIfExistAccountCpf(request, response, next) {
  const { cpf } = request.headers
  const customer = customers.find((customer) => customer.cpf === cpf)
  if (!customer) {
    return response.status(400).json({ error: 'Customer not found' })
  }
  request.customer = customer
  return next()
}

function getBalance(statement) {
  return statement.reduce((acc, operation) => {
    if (operation.type === 'credit') {
      return acc + operation.amount
    } else {
      return acc - operation.amount
    }
  }, 0)
}

const customers = []
/**
 * cpf = string
 * name = string
 * id = uuid
 * statement = []
 */
app.post('/account', (request, response) => {
  const { cpf, name } = request.body
  const id = uuidv4()
  const customerAlreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  )
  customers.push({
    cpf,
    name,
    id,
    statement: []
  })
  if (customerAlreadyExists) {
    return response.status(400).json({ error: 'Customer already exists!' })
  }
  return response.status(201).send()
})

// app.use(verifyIfExistAccountCpf)

app.get('/statement', verifyIfExistAccountCpf, (request, response) => {
  const { customer } = request
  return response.json(customer.statement)
})

app.post('/deposit', verifyIfExistAccountCpf, (request, resposnse) => {
  const { description, amount } = request.body
  const { customer } = request

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: 'credit'
  }
  customer.statement.push(statementOperation)

  return resposnse.status(201).send()
})

app.post('/withdraw', verifyIfExistAccountCpf, (request, response) => {
  const { amount } = request.body
  const { customer } = request
  const balance = getBalance(customer.statement)

  if (balance < amount) {
    return response.status(400).json({ error: 'Insufficient funds!' })
  }
  const statementOperation = {
    amount,
    created_at: new Date(),
    type: 'debit'
  }
  customer.statement.push(statementOperation)
  return response.status(201).send()
})

app.get('/statement/date', verifyIfExistAccountCpf, (request, response) => {
  const { customer } = request
  const { date } = request.query

  const dateFormat = new Date(date + ' 00:00')
  const statement = customer.statement.filter(
    (statement) =>
      statement.created_at.toDateString() ===
      new Date(dateFormat).toDateString()
  )

  return response.json(statement)
})

app.put('/account', verifyIfExistAccountCpf, (request, response) => {
  const { name } = request.body
  const { customer } = request
  customer.name = name
  return response.status(201).send()
})

app.get('/account', verifyIfExistAccountCpf, (request, response) => {
  const { customer } = request
  return response.json(customer)
})

app.delete('/account', verifyIfExistAccountCpf, (request, response) => {
  const { customer } = request
  const customerIndex = customers.findIndex((item) => item.id === customer.id)
  if (customerIndex === -1) {
    return response.status(404).json({ error: 'Customer not found' })
  }
  customers.splice(customerIndex, 1)
  return response.status(204).json()
})

app.get('/balance', verifyIfExistAccountCpf, (request, response) => {
  const { customer } = request
  const balance = getBalance(customer.statement)

  return response.json(balance)
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
  const { id } = request.params

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
