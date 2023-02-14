# mysqldump2remote
Dump specified table on database and restore to remote destination.

## Prerequirement
`git` & `node.js` & `npm`

## Install
```
git clone https://github.com/Shiaobin/mysqldump2remote.git
cd mysqldump2remote
npm install
```

## Usage
```
usage: node mysqldump2remote.js source_db destination_db
                                --sh=source_host
                                --su=source_user
                                --sp=source_password
                                --st=source_table
                                --dh=destination_host
                                --du=destination_user
                                --dp=destination_password
```

## Example
```
$ node mysqldump2remote.js course course --sh=localhost  --su=teacher --sp=teacher --st=teacher --dh=192.168.2.90 --du=teacher --dp=teacher
Dumping from course.teacher on teacher@localhost ......
Restoring to course on teacher@192.168.2.90 ......
Done!
```
