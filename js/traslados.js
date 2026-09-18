{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, Helvetica, sans-serif;
}

body {
    background-color: #f4f6f8;
    color: #333;
}

header {
    background-color: #cececf;
    padding: 15px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

header h1 {
    font-size: 20px;
    color: #2c3e50;
}

nav a {
    color: #2c3e50;
    text-decoration: none;
    font-weight: bold;
    margin: 0 8px;
}

nav a:hover {
    color: #0056b3;
}

main {
    max-width: 900px;
    margin: 30px auto;
    padding: 20px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

h2 {
    margin-bottom: 20px;
    color: #2c3e50;
    border-bottom: 2px solid #cececf;
    padding-bottom: 5px;
}

form {
    margin-bottom: 30px;
}

label {
    font-weight: bold;
    display: block;
    margin-top: 10px;
}

input[type="text"],
input[type="password"],
select,
input[type="file"] {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

input[type="submit"] {
    background-color: #2c3e50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 15px;
}

input[type="submit"]:hover {
    background-color: #1a252f;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
}

table, th, td {
    border: 1px solid #ddd;
}

th, td {
    padding: 12px;
    text-align: left;
}

th {
    background-color: #f2f2f2;
}

footer {
    text-align: center;
    padding: 20px;
    margin-top: 40px;
    font-size: 14px;
    color: #666;
}