import mysql.connector
from mysql.connector import Error

# MySQL connection details for XAMPP
host = "127.0.0.1"  # or "localhost"
user = "root"        # Default user for MySQL in XAMPP
password = ""        # Default password for MySQL in XAMPP (empty)
database = "your_database_name"  # Specify the database you want to use

def test_mysql_connection():
    connection = None
    try:
        # Establish connection to the MySQL server
        connection = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database
        )

        # Check if the connection was successful
        if connection.is_connected():
            print(f"Successfully connected to the database: {database}")
            
            # Get MySQL server information
            db_info = connection.get_server_info()
            print(f"MySQL Server version: {db_info}")

            # Test by executing a query to show databases
            cursor = connection.cursor()
            cursor.execute("SHOW DATABASES;")
            databases = cursor.fetchall()
            print("Databases on the server:")
            for db in databases:
                print(db[0])

            # Test by selecting a small set of data from a table (assuming 'users' table exists)
            cursor.execute("SELECT * FROM users LIMIT 5;")
            result = cursor.fetchall()
            print("\nSample data from 'users' table:")
            for row in result:
                print(row)

    except Error as e:
        print(f"Error: {e}")
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()
            print("\nConnection closed.")

# Run the connection test
test_mysql_connection()
