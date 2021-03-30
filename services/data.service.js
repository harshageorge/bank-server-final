let accountDetails = {
    1000: { acno: 1000, username: "harsha", balance: 5000, password: "user1" },
    1001: { acno: 1001, username: "usertwo", balance: 3000, password: "user2" },
    1002: { acno: 1002, username: "userthree", balance: 4000, password: "user3" },
    1003: { acno: 1003, username: "userfour", balance: 9000, password: "user4" },
    1004: { acno: 1004, username: "userfive", balance: 9000, password: "user5" }
}

let currentuser;

const register = (acno, username, password) => {
    // console.log("register called")
    if (acno in accountDetails) {

        return {
            status: false,
            statusCode: 422,
            message: "user already exist.Please Log in"
        }
    }

    accountDetails[acno] = {
        acno,
        username,
        balance: 0,
        password
    }
    // this.saveDetails();

    // console.log(this.accountDetails);
    return {
        status: true,
        statusCode: 200,
        message: "registration successful"

    }
}

const login = (req,acno, password) => {
    let dataset = accountDetails;

    if (acno in dataset) {
        var pswd1 = dataset[acno].password;
        if (pswd1 == password) {
         req.session.currentuser = dataset[acno];


            return {
                status: true,
                statusCode: 200,
                message: "login successfull"
            }
        }



        else {

            return {
                status: false,
                statusCode: 422,
                message: "incorrect password"
            }
        }
    }
    else {

        return {
            status: false,
            statusCode: 422,
            message: "incorrect accno"
        }
    }



}


const deposit = (acno,pwd,amount) => {


    var amt = parseInt(amount);
    let dataset = accountDetails;

    if (acno in dataset) {
        var pswd1 = dataset[acno].password;
        if (pswd1 == pwd) {

            dataset[acno].balance += amt;
            //this.saveDetails();
            return {
                status: true,
                statusCode: 200,
                message: "Account has been credited",
                balance: dataset[acno].balance
            }

        }


        else {
            return {
                status: false,
                statusCode: 422,
                message: "incorrect password",

            }

        }
    }
    else {
        return {
            status: false,
            statusCode: 422,
            message: "incorrect accno",

        }

    }
}




const withdraw = (acno,pwd,amount) => {
    var amt = parseInt(amount);
    let dataset = accountDetails;

    if (acno in dataset) {
        var pswd1 = dataset[acno].password;
        if (pswd1 == pwd) {
            if (amt <= dataset[acno].balance) {
                dataset[acno].balance -= amt;
                //this.saveDetails();
                return {
                    status: true,
                    statusCode: 200,
                    message: "Account has been debited",
                    balance: dataset[acno].balance
                }


            }
            else {
                return {
                    status: false,
                    statusCode: 422,
                    message: "insufficient balance",

                }

            }

        }
        else {
            return {
                status: false,
                statusCode: 422,
                message: "incorrect password",

            }


        }
    }
    else {
        return {
            status: false,
            statusCode: 422,
            message: "incorrect accno",

        }



    }



}












module.exports = {
    register,
    login,
    deposit,
    withdraw
}