# Kill Koa


## Get Started

### 1、init database
```sh
# login mysql by root user and create database
CREATE DATABASE kill_koa;

# create mysql new user
CREATE USER 'lgc'@'%' IDENTIFIED BY 'lgc123456'

# grant privilege
use mysql # 使用mysql数据库
update user set host='%' where user='lgc' # 特定用户的host 修改
grant all privileges on kill_koa.* to 'lgc'@'%' # 指定用户的授权
mysql -ulgc -p # test login

# set the ormconfig.json file
```

### 2、install npm packages
```sh
yarn
```

### 3、start dev
```sh
yarn start
```
