const { createOrUpdateContact, findPhoneNumberUser, getDetailContact } = require("../models/contact")

const createContact = async (req, res) => {
    const userId = req.user.id 
    const { phoneNumber } = req.body

    try{
        if (!phoneNumber || phoneNumber.length === 0){
            return res.status(400).json({ message : "The list of mobile numbers cannot be empty."})
        }

        const foundUser = await findPhoneNumberUser(phoneNumber)

        if (foundUser.length === 0) {
            return res.status(200).json({ message : "No matching contacts in the system"})
        }

        const createdContact = []
        for (const found of foundUser) {
            if (foundUser.id !== userId) {
                const contact = await createOrUpdateContact(userId, found.id)
                if (contact) createdContact.push(contact)
            }
        }

        res.status(200).json({
            message : "Contact added successfully"
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({message: "An error occurred on the server"})
    }
}

const getContact = async (req, res) => {
    const userId = req.user.id

    try{
        const contact = await getDetailContact(userId)

        if (contact.length === 0){
            return res.status(200).json({message : "No contacts saved yet"})
        }

        res.status(200).json({
            message : "Contact list successfully retrieved",
            data : contact,
        })

    }catch(err){
        console.log(err)
        return res.status(500).json({message: "An error occurred on the server"})
    }
}

module.exports = {createContact, getContact}