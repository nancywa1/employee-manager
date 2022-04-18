// const res = require('express/lib/response');
const res = require('express/lib/response');
const inquirer = require('inquirer');
const db = require('./db/connection');

function startInit() {
    return inquirer
        .prompt([
            {
                name: 'action',
                message: 'What would you like to do?',
                type: "list",
                choices: [
                    "View All Employees",
                    "View All Add Departments",
                    "View All Roles",
                    "Add Employees",
                    "Add Departments",
                    "Add Roles",
                    "Update Employee information",
                    "Exit"
                ]

            },
        ])
        .then(answers => {
            console.info('Answer:', answers.action);
            switch (answers.action) {
                case "View All Employees":
                    viewAllEmployees();
                    break;
                case "View All Departments":
                    viewAllDepartments();
                    break;
                case "View All Roles":
                    viewAllRoles();
                    break;
                case "Add Employees":
                    addEmployees();
                    break;
                case "Add Departments":
                    addDepartments();
                    break;
                case "Add Roles":
                    addRole();
                    break;
                case "Update Employee information":
                    updateEmployeeInfo();
                    break
                case "Exit":
                    process.exit();
                    // break;
            }
        });
};
function viewAllEmployees() {
    db.query(`SELECT * FROM employee`,
        (err, result) => {
            if (err) throw err
            console.table(result);
            startInit()
        });

};
function viewAllDepartments() {
    db.query(`SELECT * FROM department`,
        (err, result) => {
            if (err) throw err
            console.table(result);
            startInit()
        });

};
function viewAllRoles() {
    db.query(`SELECT * FROM role`,
        (err, result) => {
            if (err) throw err
            console.table(result);
            startInit()
        });

};

function addDepartments() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "Please enter the new department name"
        }
    ])
        .then(
            department => {
                db.query(
                    `INSERT INTO department SET ?`, department,
                    (err, result) => {
                        if (err) throw err
                        if (result.affectedRows > 0) {
                            console.log("Department was added!");
                        }

                        startInit()
                    }
                )
            }
        )
};

function addRole() {
    db.query(`SELECT * FROM department`, (err, result) => {
        result = result.map(department => {
            return {
                name: department.name,
                value: department.id
            }
        })
        inquirer.prompt([
            {
                name: "title",
                type: "input",
                message: "Please enter new role title:"
            },
            {
                name: "salary",
                type: "number",
                message: "Please enter new role salary:"
            },
            {
                name: "department_id",
                type: "list",
                message: "Please choose role department:",
                choices: result
            }
        ])
            .then(
                role => {
                    db.query(

                        `INSERT INTO role SET ?`, role,
                        (err, result) => {
                            if (err) throw err
                            if (result.affectedRows > 0) {
                                console.log("Role was added!");
                            }

                            startInit()
                        }
                    )
                }
            )
    })
}

function addEmployees() {
    db.query(`SELECT * FROM role`, (err, result) => {
        result = result.map(role => {
            return {
                name: role.title,
                value: role.id
            }
        })
        db.query(`SELECT * FROM employee`, (err, manager) => {
            manager = manager.map(employee => {
                return {
                    name: employee.first_name + " " + employee.last_name,
                    value: employee.id
                }
            })
            inquirer.prompt([
                {
                    name: "first_name",
                    type: "input",
                    message: "Please enter employee first name:"
                },
                {
                    name: "last_name",
                    type: "input",
                    message: "Please enter employee last name:"
                },
                {
                    name: "role_id",
                    type: "list",
                    message: "Please select a employee title:",
                    choices: result
                },
                {
                    name: "manager_id",
                    type: "list",
                    message: "Please select employee manager name:",
                    choices: manager
                },
            ])
                .then(
                    employee => {
                        db.query(
                            `INSERT INTO employee SET ?`, employee,
                            (err, result) => {
                                if (err) throw err
                                if (result.affectedRows > 0) {
                                    console.log("Employee was added!");
                                }

                                startInit()
                            }
                        )
                    }
                )
        }
        )
    }
    )
}
function updateEmployeeInfo() {

    db.query(`SELECT * FROM employee`, (err, manager) => {
        manager = manager.map(employee => {
            return {
                name: employee.first_name + " " + employee.last_name,
                value: employee.id
            }
        })
        db.query(`SELECT * FROM role`, (err, result) => {
            result = result.map(role => {
                return {
                    name: role.title,
                    value: role.id
                }
            })
            inquirer.prompt([

                {
                    name: "id",
                    type: "list",
                    message: "Please list the employee name that need to update:",
                    choices: manager
                },
                {
                    name: "role_id",
                    type: "list",
                    message: "Please select the new role of employee:",
                    choices: result
                }
            ])
                .then(
                    employee => {
                        db.query(
                            `UPDATE employee SET role_id=? WHERE id=?`, [employee.role_id,employee.id],
                            (err, result) => {
                                if (err) throw err
                                if (result.affectedRows > 0) {
                                    // console.log("Role was updates!");
                                    console.table(result)
                                }
                                startInit()
                            }
                        )
                    }
                )
        }
        )
    }
    )
}
startInit();