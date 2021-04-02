import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core"

export default {
    entities: [Post],
    dbName: 'lireddit',//may need set user,pass,
    user : 'postgres',
    password : 'admin',
    type: 'postgresql',//run
    debug: !__prod__    
} as Parameters<typeof MikroORM.init>[0];


