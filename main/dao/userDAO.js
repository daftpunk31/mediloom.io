import pool from '../postgres_db_config/db.js';
import bcrypt from 'bcryptjs';

class UserDAO {
    // Register a new user (hashes password before saving)
    static async createUser(firstname,phone,aadhar,email,password,role,hospitalID, gender,birthdate) {
        const hashedPassword = await bcrypt.hash(password, 10); // Hashing password
        // console.log('hashedPassword:', hashedPassword);
        console.log("Role:", role);
        console.log("Hospital ID:", hospitalID);
        let result;
        if (role==="Doctor/Medical Professional"){
            result = await pool.query(
            'INSERT INTO doctors (doc_id, email, password,phone,first_name,hospital_id,gender,birthdate) VALUES ($1, $2, $3, $4, $5, $6, $7,$8) RETURNING doc_id, first_name, email',
            [aadhar, email, hashedPassword,phone,firstname,hospitalID,gender,birthdate]
        );
        }
        else if(role==='Civilian'){
                result = await pool.query(
                'INSERT INTO users (email, password,phone,aadhar,first_name,gender,birthdate) VALUES ($1, $2, $3, $4, $5, $6,$7) RETURNING aadhar, first_name, email',
                [email, hashedPassword,phone,aadhar,firstname,gender,birthdate]
            );

        }
        else if(role==="Hospital Admin"){
                result = await pool.query(
                'INSERT INTO hospital_admins (admin_id,email, password,phone,first_name,hospital_id,gender,birthdate) VALUES ($1, $2, $3, $4, $5, $6, $7,$8) RETURNING admin_id, first_name, email',
                [aadhar, email, hashedPassword,phone,firstname,hospitalID,gender,birthdate]
            );

        }
        else if(role==="Policymaker"){
            result = await pool.query(
                'INSERT INTO policymakers (email, password,phone,aadhar,first_name,gender,birthdate) VALUES ($1, $2, $3, $4, $5, $6,$7) RETURNING aadhar, first_name, email',
                [email, hashedPassword,phone,aadhar,firstname,gender,birthdate]
            );
        }
        else {
            console.log(Error) // Handle invalid roles
            throw new Error("Error while creating new user.");
        }


        // console.log(result.rows[0]);
        return result.rows[0];
    }

    // Fetch user by email (used for login authentication)
    static async getUserByEmail(email,role) {
        let result;
        if (role === "Doctor/Medical Professional"){
            result = await pool.query
            ('SELECT * FROM doctors WHERE email = $1', [email]);
            // console.log('getUserByEmail:', result.rows[0]);
            return result.rows[0]; // Returns user object if found
        }
        else if(role === "Civilian"){
            result = await pool.query
            ('SELECT * FROM users WHERE email = $1', [email]);
            // console.log('getUserByEmail:', result.rows[0]);
            return result.rows[0]; // Returns user object if found
        }
        else if(role === "Hospital Admin"){
            result = await pool.query
            ('SELECT * FROM hospital_admins WHERE email = $1', [email]);
            // console.log('getUserByEmail:', result.rows[0]);
            return result.rows[0]; // Returns user object if found
        }
        else if(role === "Policymaker"){
            result = await pool.query
            ('SELECT * FROM policymakers WHERE email = $1', [email]);
            // console.log('getUserByEmail:', result.rows[0]);
            return result.rows[0]; // Returns user object if found
        }
        else {
            throw new Error("Error while checking for existing users."); // Handle invalid roles
        }
        return result.rows[0];
    }

    // Validate password during login
    static async verifyPassword(storedPassword, enteredPassword) {
        // console.log('storedPassword:', storedPassword);
        // console.log('enteredPassword:', enteredPassword);
        return await bcrypt.compare(enteredPassword, storedPassword); // Returns true or false
    }

    static async getCivilianByPhone(phone) {
        const result = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
        return result.rows[0]; // Returns user object if found
    }

    static async getCivilianByAadhar(aadhar) {
        const result = await pool.query('SELECT * FROM users WHERE aadhar = $1', [aadhar]);
        return result.rows[0]; // Returns user object if found
    }
}

export default UserDAO;
