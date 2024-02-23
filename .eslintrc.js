module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
<<<<<<< HEAD
    "extends": "standard-with-typescript",
=======
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
>>>>>>> ff3902ea565444867dc3229ebac7d19fe404ef47
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
<<<<<<< HEAD
=======
    "parser": "@typescript-eslint/parser",
>>>>>>> ff3902ea565444867dc3229ebac7d19fe404ef47
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
<<<<<<< HEAD
=======
    "plugins": [
        "@typescript-eslint"
    ],
>>>>>>> ff3902ea565444867dc3229ebac7d19fe404ef47
    "rules": {
    }
}
