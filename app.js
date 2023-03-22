const http = require('http');
http.createServer((req, res) => {
	res.write("Welcome to my bio - Abdul Mubeen");
	res.end();
}
).listen(3000);

console.log("Server started on port 3000");
