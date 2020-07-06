const express = require('express');
const app = express();
const Joi = require('joi'); // Returns a class
app.use(express.json()); // Calls/Adding piece of middleware

const courses = [
    { id: 1, name: 'courses1' },
    { id: 2, name: 'courses2' },
    { id: 3, name: 'courses3' }
]

app.get('/', (req,res) =>
{
    res.send('Hello World');
    console.log('Test');
});

/* In a real world you'll want to get list of cources from database.
    We do not have if blocks, we define new rought using calling
    app.get. As application grows we can move these roughts to different
    files i.e to courses.js. */
app.get('/api/courses', (req, res) =>
{
    console.log('Hello from get /api/courses');
    res.send(courses);
});

app.get('/api/courses/:id', (req,res) =>
{
    //res.send(req.params.id);
    //res.send(req.query);
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course the given ID was not found');
    res.send(course); //Returns object
    console.log('Hello from get /api/courses/:id');
});

// Responding to HTTP POST request. Must enable parsing of json objects in the body
// of the request by app.use(express.json());. Use Npm joi to check
//  if the req is a valid obj.
app.post('/api/courses', (req, res) =>
{
    /*
    const schema = 
    {
        name: Joi.string().min(3).required() //Set item so that mim 3 charc and string
    };
    const result = Joi.validate(req.body, schema);
    console.log(result);
    if (result.error)
    {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    */
   const { error } = validateCourse(req.body); // Using object destructor feature and modern js. Has two properties error & value.
   //console.log(result);
   if (error)
   {
       res.status(400).send(error.details[0].message);
       return;
   }
   const course = 
   {
       id: courses.length + 1,
       name: req.body.name
   };
   courses.push(course);
   res.send(course);
   console.log('Hello from post /api/courses');
});

//Handling PUT Request. 
app.put('/api/courses/:id', (req,res) =>
{
    //Look up the course. Copy from app.get('/api/courses/:id). 
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course the given ID was not found');
    //Validate. Copy from app.post('/api/courses').
    //const result = validateCourse(req.body); // With the usage result.error
    const { error } = validateCourse(req.body); // Using object destructor feature and modern js. Has two properties error & value.
    //console.log(result);
    if (error)
    {
        res.status(400).send(error.details[0].message);
        return;
    }
    //Update course
    course.name = req.body.name;
    res.send(course);
});

function validateCourse(course)
{
    const schema = 
    {
        name: Joi.string().min(3).required() //Set item so that mim 3 charc and string
    };
    return Joi.validate(course, schema);
};

//Handling Delete Request
app.delete('/api/courses/:id', (req, res) =>
{
    // Look up the course
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course the given ID was not found');
    // Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    // Return the same course
    res.send(course);
});

// Two paramenters. I inputed i.e. '/api/posts/2018/1' and got
//  {"year":"2018","month":"1"}. Also can use query string parameter
/* 
app.get('/api/posts/:year/:month', (req,res) =>
{
    res.send(req.query);
}) 
*/

// PORT. value of port variable
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port ${port}...`));

//Note: Check out and learn - Node package manager, Asynchronous Javascript(Callbacks, \
//      promises, async and await), CRUD operation,
//      Data Validation, Authentication and 
//      Authorization(using JSON web tokens, including
//      role management handling), Handling and Logging Errors
//      , Unite and Itegration Testing, Test-driven Development
//      Deployment