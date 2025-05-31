import express from 'express';

const server = express()

 server.listen(4321, () => {
      console.log('Server run in url : http://localhost:4321/');
    });