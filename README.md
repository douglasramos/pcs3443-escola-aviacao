# Escola Aviação (Voe Mais)

This project consists of a corporate system for aviation schools.

## Setup

### Python 3

This project requires python3. You can find a installation guide and integration with VS code on this [link](https://code.visualstudio.com/docs/python/python-tutorial)

### Virtual Enviroment

It is important to create a virtual environment, that isolates the project's dependencies. To do this, we will use the built-in command of python 3:

```cmd
python -m venv venv
```

where the last **venv** is the folder's name where the virtual enviroment configuration will exist.

Now activate the virtual environment:

```cmd
venv\Scripts\activate
```

### Installing dependencies

To install dependencies necessary for the project, do:

```cmd
pip install -r requirements.txt
```

## Run the project

you can run the project with the following commands:

```cmd
cd src && python app.py
```

To run backend api. And:

```cmd
.....
```

To run the frontend.

If you use **vscode**, you can just **Run Build Task (Ctrl + Shift + B)** to build and run the backend and the front end at the same time.

The backend api will be running on http://127.0.0.1:5000/api root. If you go to this socket, you can see a swagger documentation for the api, that allows you to see the documentation for all endpoints and test which one of them.

You can test the endpoints using a rest API software of your choice or even via console through the **curl**. Example:

```bash
curl http://127.0.0.1:5000/api/instructor
```

### Project's source code structure

```bash
src
├── api                # rest api framework module.
|   ├── endpoinsts     # endpoints splitted by context.
|   └── api.py         # api information
├── application        # UseCases module.
├── common             # Common code that is used by all modules
├── core               # module with all the business logic, entity (domain) models.
├── persistance        # All persistance related stuff goes here.
├── presentation       # The React frontend goes here.
├── app.py             # the api app will start from here.
```