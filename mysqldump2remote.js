import parseArgs from 'minimist'
import mysqldump from 'mysqldump'
import mysql from 'mysql'

(async function () {
    try {
        // Parse command line arguments or show usage
        const argv = parseArgs(process.argv.slice(2))
        if (
            argv._.length !== 2 ||
            !argv.hasOwnProperty('sh') ||
            !argv.hasOwnProperty('su') ||
            !argv.hasOwnProperty('sp') ||
            !argv.hasOwnProperty('st') ||
            !argv.hasOwnProperty('dh') ||
            !argv.hasOwnProperty('du') ||
            !argv.hasOwnProperty('dp')
        ) {
            console.log(`usage: node mysqldump2remote.js source_db destination_db
                                --sh=source_host
                                --su=source_user
                                --sp=source_password
                                --st=source_table
                                --dh=destination_host
                                --du=destination_user
                                --dp=destination_password`)
            return
        }

        const source_host = argv.sh
        const source_user = argv.su
        const source_password = argv.sp
        const source_db = argv._[0]
        const source_table = argv.st
        const destination_host = argv.dh
        const destination_user = argv.du
        const destination_password = argv.dp
        const destination_db = argv._[1]

        // Dump local table on database
        console.log(`Dumping from ${source_db}.${source_table} on ${source_user}@${source_host} ......`)
        const result = await mysqldump({
            connection: {
                host: source_host,
                user: source_user,
                password: source_password,
                database: source_db,
            },
            dump: { schema: { table: { dropIfExist: true } } },
        })
        const table = result.tables.find(function (table) {
            return table.name === source_table
        })
        const dump = table.schema + table.data

        // Restore to remote database
        console.log(`Restoring to ${destination_db} on ${destination_user}@${destination_host} ......`)
        const connection = mysql.createConnection({
            host: destination_host,
            user: destination_user,
            password: destination_password,
            database: destination_db,
            multipleStatements: true,
        })
        connection.query(dump, function (err, result, fields) {
            if (err) throw err
            console.log('Done!')
        })
        connection.end()
    } catch (err) {
        console.error(err)
    }
}()).catch(function (error) {
    console.log(error.message)
})
