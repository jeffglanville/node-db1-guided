const express = require("express")
const db = require("../data/config")

const router = express.Router()

router.get("/", async (req, res, next) => {
    try {
        const messages = await db.select("*").from("messages")

        res.json(messages)
    } catch (err) {
        next(err)
    }
})

router.get("/:id", async (req, res, next) => {
    try {
        const [message] = await db.select("*").from("messages").where("id", req.params.id).limit(1)

        res.json(message)
    }catch(err) {
        next(err)
    }
})

router.post("/", async (req, res, next) => {
    try {
        const [id] = await db.insert({
            title: req.body.title,
            contents: req.body.contents
        })
        .into("messages")
                               //replaces .select and .from, replaces .limit(1)
        const message = await db("messages").where("id", id).first()

        res.status(201).json(message)
    }catch(err) {
        next(err)
    }
})

router.put("/:id", async (req, res, next) => {
    try {
        await db("messages")
        .update({
            title: req.body.title,
            contents: req.body.contents
        })
        .where("id", req.params.id)

        const message = await db("messages")
        .where("id", req.params.id)
        .first()

        res.json(message)
    }catch(err) {
        next(err)
    }

})

router.delete("/:id", async (req, res, next) => {
    try {
       await db("messages").where("id", req.params.id)
       .del()

        res.status(204).end()
    } catch(err) {
        next(err)
    }
})

module.exports = router