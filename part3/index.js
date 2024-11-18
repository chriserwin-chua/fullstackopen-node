const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((n) => Number(n.id))) : 0;
  return String(maxId + 1);
};
app.use(cors());
app.use(express.json());
morgan.token('body', function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.post('/api/persons', (request, response) => {
  if (!request.body) {
    return response.status(400).json({
      error: 'content missing',
    });
  }

  if (!request.body.name || !request.body.number) {
    return response.status(400).json({
      error: 'name and number should be provided.',
    });
  }

  const validatePerson = persons.find(
    (person) => person.name === request.body.name
  );
  if (validatePerson) {
    return response.status(400).json({
      error: 'name must be unique',
    });
  }

  const person = {
    namee: request.body.name,
    number: request.body.number,
    id: generateId(),
  };

  persons = persons.concat(person);

  response.json(person);
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).json('Person not found.');
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.get('/api/info', (request, response) => {
  const displayDate = new Date();
  response.send(
    `<p>Phone book has ${persons.length} info.</p><br/><p>${displayDate}</p>`
  );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
