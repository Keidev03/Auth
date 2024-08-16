import swaggerJsDoc from 'swagger-jsdoc'

import config from '../config'

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Auth APIs",
            version: "1.0.0",
            descripton: "A simple express libary API"
        },
        servers: [{ url: config.env.baseURL }]
    },
    apis: [`src/routes/*.ts`, `src/models/*.ts`]
}

const specs = swaggerJsDoc(options)


export default specs