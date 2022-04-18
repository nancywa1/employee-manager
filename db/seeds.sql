INSERT INTO department(name)
VALUES("Legal"), ("Complaince"), ("Document"), ("Call Center"), ("Information Techology");

INSERT INTO role(title, salary, department_id)
VALUES("Engineer", 75000, 1), ("Senior Engineer", 100000, 1), ("CFO", 150000, 3), ("Chief Counsel", 200000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ('Randall', 'Random', 2, NULL), ('James', 'Rachard', 2, NULL), ('John', 'Doe', 3, NULL), ('Nicole', 'Jones', 2, 3), ('Lisa', 'Evans', 1, 2);