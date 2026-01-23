import server from './server/index.js';
 
const host = process.env.PORT; 
const port = process.env.HOST;
 
server.listen(port, () => {
 console.log(`Server running at http://${host}:${port}`);
});