##step

npm init -y
npm i typescript 
npx tsc --init

change tsconfig.json rootdir , outdir to src and dist 
add dev script 

```
"dev" : "tsc -b && node ./dist/index.js"
```

install orm - npm install prisma
npx prisma init

change in the schema.prisma
```
model User{
  id        Int @default(autoincrement()) @id
  username  String @unique
  password  String
  age       Int
}

```
npx prisma migrate dev [--for creating the  table automatically by just writing this thing ]
npx prisma generate [--if i clone the others projectc this line will help him to clone the tables  as well]



many to one relationship we add this 
```

User tables:   
    id    Int
    todo Todo[]   :: many

Todo tables:

    userId Int  
    user  User @reation(fields[userId], refrence[id]) ::  one 
    
```