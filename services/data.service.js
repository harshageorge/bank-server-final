
const db = require('./db');


let accountDetails = {
    1000: { acno: 1000, username: "harsha", balance: 5000, password: "user1" },
    1001: { acno: 1001, username: "usertwo", balance: 3000, password: "user2" },
    1002: { acno: 1002, username: "userthree", balance: 4000, password: "user3" },
    1003: { acno: 1003, username: "userfour", balance: 9000, password: "user4" },
    1004: { acno: 1004, username: "userfive", balance: 9000, password: "user5" }
}

let currentuser;

const register = (acno, username, password) => {
  return db.User.findOne({
        acno
    }).then(user => {
        // console.log(user)
        if (user) {
            return {
                status: false,
                statusCode: 422,
                message: "user already exist.Please Log in"
            }
        }
        else {
            const newUser = new db.User({
                acno,
                username,
                balance: 0,
                password

            });
            newUser.save();
            return {
                status: true,
                statusCode: 200,
                message: "registration successful"

            }
        }
    })


}

const login = (req, accno, password) => {
    var acno = parseInt(accno);
    return db.User.findOne({
        acno,
        password
    }).then(user => {
        if (user) {
            req.session.currentuser = user.acno
            return {
                status: true,
                statusCode: 200,
                message: "login successfull",
                name:user.username,
                acno:user.acno
            }

        }

        return {
            status: false,
            statusCode: 422,
            message: "invalid credentials"
        }



    })
}



const deposit = (acno, pwd, amount) => {
    var amt = parseInt(amount);


    return db.User.findOne({
        acno,
        password: pwd
    }).then(user => {
        if (!user) {
            return {
                status: false,
                statusCode: 422,
                message: "no user exist with accno",

            }
        }
        user.balance += amt;
        user.save();
        return {
            status: true,
            statusCode: 200,
            message: "Account has been credited",
            balance: user.balance
        }
    })
}




const withdraw = (req,acno, pwd, amount) => {
    var amt = parseInt(amount);
    //let dataset = accountDetails;

    return db.User.findOne({
        acno,
        password: pwd
    }).then(user => {
        
        if (!user) {
            return {
                status: false,
                statusCode: 422,
                message: "no user exist with accno",

            }
        }
        if((req.session.currentuser)!=acno){
            return {
                status: false,
                statusCode: 422,
                message: "permission denied",

            }
        }
        if (user.balance < amt) {
            return {
                status: false,
                statusCode: 422,
                message: "insufficient balance",

            }

        } else {
            user.balance -= amt;
            user.save();
            return {
                status: true,
                statusCode: 200,
                message: "Account has been debited",
                balance: user.balance
            }

        }
    })




    
}

const deleteAccDetails=(acno)=>{
    return db.User.deleteOne({
        acno:acno
    }).then(user => {
        
        if (!user) {
            return {
                status: false,
                statusCode: 422,
                message: "permission denied",

            }
        }
        return {
            status: true,
            statusCode: 200,
            message: "Account number" +acno+"deleted successfully"
            
        }
})
}













module.exports = {
    register,
    login,
    deposit,
    withdraw,
    deleteAccDetails
}