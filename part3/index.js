require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(cors())
app.use(express.json())
morgan.token('body', function (req) {
  return JSON.stringify(req.body)
})
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)
app.use(express.static('dist'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then((people) => {
    response.json(people)
  })
})

app.post('/api/persons', async (request, response, next) => {
  if (!request.body) {
    return response.status(400).json({
      error: 'content missing',
    })
  }

  if (!request.body.name || !request.body.number) {
    return response.status(400).json({
      error: 'name and number should be provided.',
    })
  }

  const validatePerson = await Person.findOne({ name: request.body.name })
  console.log(validatePerson)
  if (validatePerson) {
    return response.status(400).json({
      error: 'name must be unique',
    })
  }

  const person = new Person({
    name: request.body.name,
    number: request.body.number,
  })

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson)
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  const person = {
    name: name,
    number: number,
  }

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.use(errorHandler) //must be last

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
