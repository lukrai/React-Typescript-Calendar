# Migrations

## npx sequelize-cli model:generate

`npx sequelize-cli model:generate --name JudgeGroup --attributes timeCardCount:integer,timeCardCount:integer, startingHour:integer,startingMinute:integer,sessionTimeInMinutes:integer`

    New model was created at /server/models/judgegroup.js .
    New migration was created at /server/migrations/20211120103012-create-judge-group.js .

Existing models are okay too, you can create migration seperatly.

## npx sequelize-cli migration:generate

`npx sequelize-cli migration:generate --name migration-skeleton` will generate a file with `up` and `down` functions.

## npx sequelize-cli seed:generate

```
 npx sequelize-cli seed:generate --name demo-judge-group
 npx sequelize-cli db:seed:all

 *If you wish to undo the most recent seed:
 npx sequelize-cli db:seed:undo

 *If you wish to undo a specific seed:
 npx sequelize-cli db:seed:undo --seed name-of-seed-as-in-data

 *If you wish to undo all seeds:
 npx sequelize-cli db:seed:undo:all
```

## To run a migration

1. `npx sequelize-cli db:migrate:status`

```text
 down 20211120103012-create-judge-group.js
 down 20211121010058-migration-skeleton.js
```

2. `npx sequelize-cli db:migrate`

```
 Loaded configuration file "config/config.json".
 Using environment "development".
 == 20211120103012-create-judge-group: migrating =======
 == 20211120103012-create-judge-group: migrated (0.013s)
```

3. You can use `db:migrate:undo`, this command will revert most the recent migration.

   Also following are valid commands

```
 npx sequelize-cli db:migrate:undo:all --to XXXXXXXXXXXXXX-create-posts.js
 npx sequelize-cli db:migrate --to 20211120103012-create-judge-group.js
```
