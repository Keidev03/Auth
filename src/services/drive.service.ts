import stream from "stream"
import Jimp from "jimp"
import { google } from "googleapis"

import config from "../config"

const auth: any = new google.auth.GoogleAuth({
    keyFile: config.env.keyFilePath,
    scopes: config.env.scopes
})

const UploadImageDrive = async (fileImage: any, idUser: string) => {
    try {
        const drive = await google.drive({ version: "v3", auth: auth })
        // Convert image into binary form
        const image = await Jimp.read(fileImage.buffer)
        // Resize the image to 500x500 pixels
        const buffer = await image.resize(250, 250).getBufferAsync(Jimp.MIME_JPEG)
        // Create an intermediate stream to convert data from the buffer into a usable stream
        const bufferStream: any = new stream.PassThrough()
        // Write data to the stream
        bufferStream.end(buffer)
        const response: any = await drive.files.create({
            media: {
                mimeType: "image/jpeg",
                body: bufferStream
            },
            requestBody: {
                name: idUser,
                parents: [config.env.idFolder]
            }
        })
        const imageId: any = response.data.id
        return imageId
    } catch (error) {
        console.log(error)
    }
}

const GeneratePublicDrive = async (id: string): Promise<void> => {
    const drive = await google.drive({ version: "v3", auth: auth })
    try {
        const permissions = await drive.permissions.create({
            fileId: id,
            requestBody: {
                role: "reader",
                type: "anyone",
            },
        })
    } catch (error) {
        console.error("Error making file public: ", error)
    }
}

const DeleteFileDrive = async (id: string): Promise<void> => {
    const drive = await google.drive({ version: "v3", auth: auth })
    try {
        const response = await drive.files.delete({ fileId: id })
    } catch (error) {
        console.error("Error delete file: ", error)
    }
}

export { UploadImageDrive, GeneratePublicDrive, DeleteFileDrive }