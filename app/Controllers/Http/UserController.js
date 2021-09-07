'use strict'

const User = use('App/Models/User');
const { validate } = use('Validator')

class UserController {

    async destroy({ params, response }) {

        const { id } = params

        const validation = await validate(params, {
            id: 'required|number|min:0',
        });

        if (validation.fails()) return response.status(400).send(validation.messages());

        const user = await User.findBy('id', id)

        if (!user) return response.status(500).send({ message: "User not found" });

        await user.delete()

        return response.status(200).send({ message: 'User deleted succesfully', user })
    }

    async index({ response }) {
        const users = await User.all()
        return response.status(200).send({ users })
    }

    async show({ params, response }) {
        
        const { key, value } = params

        const validation = await validate(params, {
            key: 'required',
            value:'required'
        });

        if (validation.fails()) return response.status(400).send(validation.messages());

        const user = await User
            .query()
            .where(key, value)
            .fetch()

        if (user.rows.length === 0) return response.status(400).send({ message: "no results" })

        return response.status(200).send({ user })
    }



}

module.exports = UserController
