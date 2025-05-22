## My Library!
A simple book notes web application I made for Angela Yu's Fullstack Web Devlopment Bootcamp. Write notes about all the different manga you've read!. It uses the Kitsu API to access cover images. 
This project uses Postgresql to store all the data. You'll need pgAdmin to run this on your localhost. Create a database called booknotes and a table called mangas. Here's the SQL code to create it:
```
CREATE TABLE mangas(
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) UNIQUE,
  date DATE,
  rating INTEGER,
  summary VARCHAR,
  notes VARCHAR,
  image VARCHAR,
);
```
Make sure you replace the database's password in the index.js file with your own.
To run it, simply download the repository. Install the
necessary node modules with
```
npm i
```
then run it with 
```
nodemon server.js
```
It should run on port 3000.
**Have fun!**
