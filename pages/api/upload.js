import fs from "fs"
import path from "path"
import formidable from "formidable"

export const config = {
    api: {
        bodyParser: false,
    },
}

const readFileUploaded = async () => {
    const files = await fs.promises.readdir(path.resolve("fileuploads"))
    console.log('##files', files);
}

const handler = async (req, res) => {
    console.log("##req", req.headers.origin);
    const form = formidable({ multiples: true })

    form.parse(req, async (error, fields, files) => {
        if (!files.demo) {
            res.status(400).send("No file uploaded")
            return
        }
        const pathToFileUploadDir = path.resolve("fileuploads", `${files.demo.originalFilename}`)
        const writer = fs.createWriteStream(pathToFileUploadDir, {
            flags: "w",
        })
        const reader = fs.createReadStream(files.demo.filepath)

        const stream = reader.pipe(writer)
        stream.on('finish', () => {
            readFileUploaded()
        })
        res.status(201).json({ message: "File uploaded" })
    })
}

export default handler
