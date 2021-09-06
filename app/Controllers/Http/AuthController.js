'use strict'

const { validate } = use('Validator')
const Mail = use('Mail')
const Env = use('Env');
const jwt = require('jsonwebtoken');
const Hash = use('Hash');


const User = use('App/Models/User');


class AuthController {

    routeTemp() {
        return { message: "routeTemp" }
    }
    
    async login({ request, response, auth }) {
        const validation = await validate(request.all(), {
            email: 'required|email',
            password: 'required|min:4',

        });
        if (validation.fails()) return response.status(400).send(validation.messages());

        const user = await User.findBy('email', request.input('email'));

        if (!user) return response.status(500).send({ message: "User not found" });

        if (!user.email_verified) return response.status(400).send({ message: "Please verify your account" });

        const correctPass = await Hash.verify(request.input('password'), user.password);

        if (!correctPass) return response.status(400).send({ message: "Incorrect password" });

        const token = await auth.generate(user)

        return response.status(200).send({ message: 'user logged in successfully',token })
    }

    async resendConfirmationEmail({ request, response }) {

        const validation = await validate(request.all(), {
            email: 'required|email',
        });

        if (validation.fails()) return response.status(400).send(validation.messages());

        const user = await User.findBy('email', request.input('email'));

        if (!user) return response.status(500).send({ message: "User not found" });

        if (user.email_verified) return response.status(200).send({ message: "User is already verified" });


        const token = jwt.sign({ user_id: user.id }, Env.get('SECRET'), {
            expiresIn: "12h",
        });

        const mailTemplate = `<p>Please <a href="${Env.get('APP_URL')}/api/confirm/${token}">Confirm</a> your Account</p>`

        await Mail.raw(mailTemplate, (message) => {
            message
                .to(user.email)
                .from(Env.get('FROM_EMAIL'))
                .subject('Confirm your Account!')
        })

        return response.status(200).send({ message: 'Please check your email to confirm the account.' })

    }

    async confirmAccount({ response, params }) {
        const Token = params.token;

        let payload;

        try {
            payload = jwt.verify(Token, Env.get('SECRET'))
        } catch (error) {
            return response.status(500).send({ message: "Token is invalid or it was expired" })
        }

        const user = await User.find(payload.user_id);
        if (!user) return response.status(500).send({ message: "User not found" });
        if (user.email_verified) return response.status(200).send({ message: "User is already verified" });

        user.email_verified = true;
        await user.save();

        return response.status(200).send({ message: "account verified successfully" })

    }

    async singup({ request, response }) {

        const validation = await validate(request.all(), {
            email: 'required|email',
            firstName: 'required',
            lastName: 'required',
            password: 'required|min:4',
        });

        if (validation.fails()) return response.status(400).send(validation.messages());

        const userExists = await User.findBy('email', request.input('email'));

        if (userExists) return response.status(400).send({ message: 'An account already exists with this email' });

        const user = await User.create({
            email: request.input('email'),
            first_name: request.input('firstName'),
            last_name: request.input('lastName'),
            password: request.input('password'),
            email_verified: false,
        });

        const token = jwt.sign({ user_id: user.id }, Env.get('SECRET'), {
            expiresIn: "12h",
        });

        const mailTemplate = `<p>Please <a href="${Env.get('APP_URL')}/api/confirm/${token}">Confirm</a> your Account</p>`
        await Mail.raw(mailTemplate, (message) => {
            message
                .to(user.email)
                .from(Env.get('FROM_EMAIL'))
                .subject('Confirm your Account!')
        })

        return response.status(200).send({ message: 'Success,created please check your email to confirm the account.', user })
    }
}

module.exports = AuthController
